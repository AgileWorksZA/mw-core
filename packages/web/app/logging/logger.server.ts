import { Database } from "bun:sqlite";
import { ClientLogger } from "~/logging/client-logger";

// Initialize the database
const db = new Database("log.db");

// Create the logs moneyworks-table-editor if it doesn't exist
db.exec(`
	CREATE TABLE IF NOT EXISTS logs (
		id INTEGER PRIMARY KEY,
		path TEXT,
		tag TEXT,
		timestamp TEXT,
		message TEXT,
		level TEXT,
		system TEXT,
		occurrences INTEGER,
		last_occurrence TEXT
	);
`);

// Define the type for the logging object
type LoggingObject = {
  info: (...logData: unknown[]) => void;
  debug: (...logData: unknown[]) => void;
  warning: (...logData: unknown[]) => void;
  error: (...logData: unknown[]) => void;
};

let occurrences = 0;
let lastlog = "";
let lastInsertRowid: number | bigint = 0;

const MAX_INSERTS = 10_000;
let inserted = 0;

function log(
  level: "info" | "debug" | "warning" | "error",
  data_: unknown[],
  system: string,
  path: string | undefined,
  tag: string | undefined,
) {
  if (!data_) {
    console.error("logData must have data and type properties");
    return;
  }
  const data = Array.isArray(data_) ? data_ : [data_];
  const timestamp = new Date().toISOString();
  const message = JSON.stringify(data);

  const params: (string | null | number)[] = [
    path ?? "/",
    tag ?? null,
    timestamp,
    message,
    level,
    system,
  ];
  const log = `${system}:${level}:${message}`;
  if (log === lastlog) {
    occurrences++;
    try {
      db.prepare(`
				UPDATE logs
				SET occurrences = ?, last_occurrence = ?
				WHERE id = ${lastInsertRowid}
		`).run(occurrences + 1, timestamp);
    } catch (error) {
      console.error(error);
    }

    if (process.env.NODE_ENV === "development") {
      process.stdout.write("\x1b[1A\x1b[K");

      const logger = new ClientLogger({
        system,
        tag,
        path,
        occurrences,
      });
      logger[level](...data);
    }
    return;
  }
  lastlog = log;
  occurrences = 0;
  try {
    if (inserted < MAX_INSERTS) {
      const res = db
        .prepare(`
				INSERT INTO logs (path, tag, timestamp, message, level, system)
				VALUES (?, ?, ?, ?, ?, ?)
			`)
        .run(...params);
      lastInsertRowid = res.lastInsertRowid;
      inserted++;
    } else {
      // keep 10% of the logs
      inserted = MAX_INSERTS * 0.1 + 1;
      db.prepare(`
				DELETE FROM logs
				WHERE id NOT IN (
					SELECT id
					FROM logs
					ORDER BY id DESC
					LIMIT ${MAX_INSERTS - MAX_INSERTS * 0.1}
				)
			`).run();

      const logger = new ClientLogger({
        system: "internal",
        tag: "reset",
        path,
      });
      logger.warning(...data);
    }
  } catch (error) {
    console.error(error);
  }
  if (process.env.NODE_ENV === "development") {
    const logger = new ClientLogger({ system, tag, path });
    logger[level](...data);
  }
}

// Create a logger function that returns a logging object
export function create_logger(
  system: string,
  path?: string,
  tag?: string,
): LoggingObject {
  return {
    info: (...logData: unknown[]) => log("info", logData, system, path, tag),
    debug: (...logData: unknown[]) => log("debug", logData, system, path, tag),
    warning: (...logData: unknown[]) =>
      log("warning", logData, system, path, tag),
    error: (...logData: unknown[]) => log("error", logData, system, path, tag),
  };
}

export async function reset() {
  return db.exec(`
		DELETE FROM logs
	`);
}

export async function getLogs(limit = 100, skip = 0) {
  return db
    .query(`
	       SELECT * FROM logs     
         ORDER BY timestamp DESC 
         LIMIT ${limit} 
         OFFSET ${skip}
         `)
    .all() as unknown as {
    id: number;
    path: string;
    tag: string;
    timestamp: string;
    message: string;
    level: string;
    system: string;
    occurrences: number;
    last_occurrence: string;
  }[];
}
