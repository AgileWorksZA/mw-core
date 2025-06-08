import { gzip, gunzip } from "node:zlib";
import { promisify } from "node:util";

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export class CompressionUtil {
  private threshold: number;
  private enabled: boolean;

  constructor(enabled = true, thresholdBytes = 1024) {
    this.enabled = enabled;
    this.threshold = thresholdBytes;
  }

  async compress(data: string): Promise<{ data: Buffer | string; compressed: boolean }> {
    if (!this.enabled || data.length < this.threshold) {
      return { data, compressed: false };
    }

    const compressed = await gzipAsync(Buffer.from(data, "utf-8"));
    // Only use compression if it actually saves space
    if (compressed.length < data.length * 0.9) {
      return { data: compressed, compressed: true };
    }
    
    return { data, compressed: false };
  }

  async decompress(data: Buffer | string, isCompressed: boolean): Promise<string> {
    if (!isCompressed || typeof data === "string") {
      return typeof data === "string" ? data : data.toString("utf-8");
    }

    const decompressed = await gunzipAsync(data);
    return decompressed.toString("utf-8");
  }

  isCompressedFile(filename: string): boolean {
    return filename.endsWith(".gz");
  }
}