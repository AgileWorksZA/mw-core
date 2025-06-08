import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import type { Delta } from "jsondiffpatch";
import * as diff from "jsondiffpatch";
import type {
  ReadResult,
  StorageAdapter,
  StorageAdapterConfig,
  WriteResult,
} from "~/modules/storage/types";
import { getFsTimestamps, ensureDir } from "./lib/fs-utils";
import { TimestampGenerator } from "./lib/timestamp-generator";
import { FileLock } from "./lib/file-lock";
import { LRUCache } from "./lib/cache";
import { CompressionUtil } from "./lib/compression";
import {
  DocumentNotFoundError,
  TimestampNotFoundError,
  ValidationError,
} from "~/modules/storage/errors";

export class JsonFileStorageAdapter<TContext>
  implements StorageAdapter<TContext>
{
  private readonly basePath: string;
  private readonly timestampGen = new TimestampGenerator();
  private readonly fileLock = new FileLock();
  private readonly cache: LRUCache<TContext>;
  private readonly compression: CompressionUtil;
  private readonly config: StorageAdapterConfig<TContext>;
  private readonly snapshotInterval: number;

  constructor(props?: { basePath?: string } & StorageAdapterConfig<TContext>) {
    const {
      basePath = "./public/store-kit",
      cacheSize = 100,
      cacheMaxMemoryMB = 50,
      enableCompression = true,
      compressionThreshold = 1024,
      snapshotInterval = 50,
      ...config
    } = props || {};

    this.basePath = basePath;
    this.config = config;
    this.cache = new LRUCache(cacheSize, cacheMaxMemoryMB);
    this.compression = new CompressionUtil(
      enableCompression,
      compressionThreshold,
    );
    this.snapshotInterval = snapshotInterval;
  }

  async getStoragePath({
    type,
    id,
  }: { type: string; id: string }): Promise<string> {
    return path.join(this.basePath, type, id);
  }

  private getCacheKey(type: string, id: string, timestamp?: number): string {
    return timestamp ? `${type}/${id}@${timestamp}` : `${type}/${id}`;
  }

  private async readFile(filePath: string): Promise<string> {
    // Check if compressed version exists
    if (existsSync(`${filePath}.gz`)) {
      const data = await fs.readFile(`${filePath}.gz`);
      return this.compression.decompress(data, true);
    }

    const isCompressed = this.compression.isCompressedFile(filePath);
    const data = await fs.readFile(filePath);
    return this.compression.decompress(data, isCompressed);
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    const { data, compressed } = await this.compression.compress(content);
    const finalPath = compressed ? `${filePath}.gz` : filePath;
    await fs.writeFile(finalPath, data);
  }

  private validateContext(context: TContext): TContext {
    if (this.config.validator && !this.config.validator(context)) {
      throw new ValidationError("Invalid document structure");
    }

    if (this.config.sanitizer) {
      return this.config.sanitizer(context);
    }

    return context;
  }

  private async shouldCreateSnapshot(storagePath: string): Promise<boolean> {
    const timestamps = getFsTimestamps(storagePath);
    return timestamps.length % this.snapshotInterval === 0;
  }

  async read({
    type,
    id,
    defaultContext,
    timestamp,
  }: {
    type: string;
    id: string;
    defaultContext?: TContext;
    timestamp?: number;
  }): Promise<ReadResult<TContext>> {
    const cacheKey = this.getCacheKey(type, id, timestamp);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { data: cached.data, cursor: cached.cursor };
    }

    return this.fileLock.acquire(`${type}/${id}`, async () => {
      const storagePath = await this.getStoragePath({ type, id });
      await ensureDir(storagePath);

      const mainFilePath = path.join(storagePath, "_.json");
      const mainFileExists = existsSync(mainFilePath);

      if (timestamp) {
        const tsFilePath = path.join(storagePath, `${timestamp}.json`);
        const tsFilePathGz = `${tsFilePath}.gz`;
        if (!existsSync(tsFilePath) && !existsSync(tsFilePathGz)) {
          throw new TimestampNotFoundError(timestamp, type, id);
        }
      }

      if (!mainFileExists) {
        if (!defaultContext) {
          throw new DocumentNotFoundError(type, id);
        }

        const validatedContext = this.validateContext(defaultContext);
        const initialWriteResult = await this.write({
          type,
          id,
          defaultContext: validatedContext,
          payload: { context: validatedContext },
        });

        const result = {
          data: validatedContext,
          cursor: {
            timestamp: initialWriteResult.cursor.timestamp,
            latest: initialWriteResult.cursor.latest,
            previous: null,
            next: null,
          },
        };

        this.cache.set(cacheKey, validatedContext, result.cursor);
        return result;
      }

      const mainContent = await this.readFile(mainFilePath);
      const currentData = JSON.parse(mainContent) as TContext;
      const allTimestamps = getFsTimestamps(storagePath);

      if (allTimestamps.length === 0 && mainFileExists) {
        const now = await this.timestampGen.next();
        await this.writeFile(
          path.join(storagePath, `${now}.json`),
          JSON.stringify({ context: currentData }),
        );
        allTimestamps.push(now);
      }

      const targetTimestamp =
        timestamp ||
        (allTimestamps.length > 0
          ? allTimestamps[allTimestamps.length - 1]
          : await this.timestampGen.next());

      let dataForTimestamp = currentData;

      if (
        timestamp &&
        allTimestamps.includes(timestamp) &&
        timestamp !== allTimestamps[allTimestamps.length - 1]
      ) {
        // Look for nearest snapshot
        const snapshotPath = path.join(
          storagePath,
          `${timestamp}.snapshot.json`,
        );
        if (existsSync(snapshotPath)) {
          const snapshotContent = await this.readFile(snapshotPath);
          dataForTimestamp = JSON.parse(snapshotContent) as TContext;
        } else {
          // Reconstruct from history
          let reconstructedData = JSON.parse(JSON.stringify(currentData));
          const timestampsToReverse = allTimestamps
            .filter((t) => t > timestamp)
            .sort((a, b) => b - a);

          for (const ts of timestampsToReverse) {
            const versionFilePath = path.join(storagePath, `${ts}.json`);
            const versionContent = await this.readFile(versionFilePath);
            const versionData = JSON.parse(versionContent);

            if (versionData.delta) {
              reconstructedData = diff.patch(
                reconstructedData,
                diff.reverse(versionData.delta),
              );
            } else if (versionData.context) {
              reconstructedData = versionData.context;
            }
          }
          dataForTimestamp = reconstructedData;
        }
      }

      const latestTimestamp =
        allTimestamps.length > 0
          ? allTimestamps[allTimestamps.length - 1]
          : targetTimestamp;
      const currentIndexInAll = allTimestamps.indexOf(targetTimestamp);
      const previousTimestamp =
        currentIndexInAll > 0 ? allTimestamps[currentIndexInAll - 1] : null;
      const nextTimestamp =
        currentIndexInAll < allTimestamps.length - 1 && currentIndexInAll !== -1
          ? allTimestamps[currentIndexInAll + 1]
          : null;

      const result = {
        data: dataForTimestamp,
        cursor: {
          timestamp: targetTimestamp,
          latest: latestTimestamp,
          previous: previousTimestamp,
          next: nextTimestamp,
        },
      };

      this.cache.set(cacheKey, dataForTimestamp, result.cursor);
      return result;
    });
  }

  async write({
    type,
    id,
    defaultContext,
    payload,
  }: {
    type: string;
    id: string;
    payload: { context?: TContext; delta?: Delta; data?: TContext };
    defaultContext?: TContext;
  }): Promise<WriteResult> {
    return this.fileLock.acquire(`${type}/${id}`, async () => {
      const storagePath = await this.getStoragePath({ type, id });
      await ensureDir(storagePath);

      const contextToPersist = payload.context || payload.data;
      const { delta } = payload;

      if (!contextToPersist && !delta) {
        throw new ValidationError(
          "Either context/data or delta is required for write.",
        );
      }

      const mainFilePath = path.join(storagePath, "_.json");
      const mainFileExists = existsSync(mainFilePath);
      let previousTimestampForMeta: number | null = null;
      const allTimestamps = getFsTimestamps(storagePath);

      if (allTimestamps.length > 0) {
        previousTimestampForMeta = allTimestamps[allTimestamps.length - 1];
      }

      const newTimestamp = await this.timestampGen.next();
      const timestampFilePath = path.join(storagePath, `${newTimestamp}.json`);

      let finalContext: TContext;

      if (!mainFileExists) {
        if (!contextToPersist) {
          if (!defaultContext) {
            throw new DocumentNotFoundError(type, id);
          }
          finalContext = delta
            ? (diff.patch(
                JSON.parse(JSON.stringify(defaultContext)),
                delta,
              ) as TContext)
            : defaultContext;
          await this.writeFile(
            mainFilePath,
            JSON.stringify(finalContext, null, 2),
          );
          await this.writeFile(
            timestampFilePath,
            JSON.stringify({ delta }, null, 2),
          );
        } else {
          finalContext = this.validateContext(contextToPersist);
          await this.writeFile(
            mainFilePath,
            JSON.stringify(finalContext, null, 2),
          );
          await this.writeFile(
            timestampFilePath,
            JSON.stringify({ context: finalContext }, null, 2),
          );
        }
      } else {
        const mainContent = await this.readFile(mainFilePath);
        const existingData = JSON.parse(mainContent);

        if (contextToPersist) {
          finalContext = this.validateContext(contextToPersist);
          await this.writeFile(
            mainFilePath,
            JSON.stringify(finalContext, null, 2),
          );
          await this.writeFile(
            timestampFilePath,
            JSON.stringify({ context: finalContext }, null, 2),
          );
        } else if (delta) {
          finalContext = diff.patch(existingData, delta) as TContext;
          await this.writeFile(
            mainFilePath,
            JSON.stringify(finalContext, null, 2),
          );
          await this.writeFile(
            timestampFilePath,
            JSON.stringify({ delta }, null, 2),
          );
        } else {
          finalContext = existingData;
        }
      }

      // Create snapshot if needed
      if (await this.shouldCreateSnapshot(storagePath)) {
        const snapshotPath = path.join(
          storagePath,
          `${newTimestamp}.snapshot.json`,
        );
        await this.writeFile(
          snapshotPath,
          JSON.stringify(finalContext, null, 2),
        );
      }

      // Clear cache for this document
      this.cache.clear(); // Could be more selective

      return {
        cursor: {
          timestamp: newTimestamp,
          previous: previousTimestampForMeta,
          next: null,
          latest: newTimestamp,
        },
      };
    });
  }

  async replaceHistory({
    type,
    id,
    defaultContext,
    payload,
    afterTimestamp,
  }: {
    type: string;
    id: string;
    afterTimestamp: number;
    payload: { context: TContext; delta?: Delta };
    defaultContext?: TContext;
  }): Promise<WriteResult> {
    return this.fileLock.acquire(`${type}/${id}`, async () => {
      const storagePath = await this.getStoragePath({ type, id });
      await ensureDir(storagePath);

      const stateAtAfter = await this.read({
        type,
        id,
        defaultContext,
        timestamp: afterTimestamp,
      });
      const dataAtAfter = stateAtAfter.data;

      const mainFilePath = path.join(storagePath, "_.json");
      const newTimestamp = await this.timestampGen.next();
      const timestampFilePath = path.join(storagePath, `${newTimestamp}.json`);

      const allTimestamps = getFsTimestamps(storagePath);

      // Archive replaced history
      for (const t of allTimestamps) {
        if (t > afterTimestamp) {
          const originalTsFilePath = path.join(storagePath, `${t}.json`);
          const branchedTsFilePath = path.join(
            storagePath,
            `${afterTimestamp}.${t}.json.branch`,
          );
          try {
            if (existsSync(originalTsFilePath)) {
              await fs.rename(originalTsFilePath, branchedTsFilePath);
            }
            // Also handle compressed files
            const compressedPath = `${originalTsFilePath}.gz`;
            if (existsSync(compressedPath)) {
              await fs.rename(compressedPath, `${branchedTsFilePath}.gz`);
            }
          } catch (error: any) {
            if (error.code !== "ENOENT") throw error;
          }
        }
      }

      const finalContextAfterPayload = payload.delta
        ? (diff.patch(dataAtAfter, payload.delta) as TContext)
        : this.validateContext(payload.context);

      await this.writeFile(
        mainFilePath,
        JSON.stringify(finalContextAfterPayload, null, 2),
      );

      const versionRecord = payload.delta
        ? { delta: payload.delta, contextHint: payload.context }
        : { context: payload.context };
      await this.writeFile(
        timestampFilePath,
        JSON.stringify(versionRecord, null, 2),
      );

      // Clear cache
      this.cache.clear();

      return {
        cursor: {
          timestamp: newTimestamp,
          previous: afterTimestamp,
          next: null,
          latest: newTimestamp,
        },
      };
    });
  }

  async getAll({
    type,
  }: { type: string }): Promise<{ id: string; path: string }[]> {
    const typePath = path.join(this.basePath, type);
    if (!existsSync(typePath)) {
      return [];
    }

    const documents: { id: string; path: string }[] = [];
    const idDirents = await fs.readdir(typePath, { withFileTypes: true });

    for (const dirent of idDirents) {
      if (dirent.isDirectory()) {
        const docId = dirent.name;
        const mainFilePath = path.join(typePath, docId, "_.json");
        if (existsSync(mainFilePath)) {
          try {
            documents.push({
              id: docId,
              path: path.join(type, docId),
            });
          } catch (error) {
            console.error(
              `Error reading document ${type}/${docId} in getAll:`,
              error,
            );
          }
        }
      }
    }
    return documents;
  }

  async deleteDocument(props: { type: string; id: string }): Promise<void> {
    return this.fileLock.acquire(`${props.type}/${props.id}`, async () => {
      const storagePath = await this.getStoragePath(props);
      const trashPath = await this.getStoragePath({
        type: "trash",
        id: props.type,
      });
      await ensureDir(trashPath);
      await fs.rename(storagePath, `${trashPath}/${props.id}`);

      // Clear cache
      this.cache.clear();
    });
  }
}

const json_file_adapter = new JsonFileStorageAdapter<{ id: string }>();

export default json_file_adapter;
