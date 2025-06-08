const isBrowser = typeof window !== "undefined";
let lastday = 0;

// Helper functions to apply ANSI color codes
function colorString(str: string): string {
	return `\x1b[32m${str}\x1b[0m`; // Green for strings
}

function colorNumber(num: string): string {
	return `\x1b[34m${num}\x1b[0m`; // Blue for numbers
}

function colorBoolean(bool: string): string {
	return `\x1b[33m${bool}\x1b[0m`; // Yellow for booleans
}

function colorNull(nullStr: string): string {
	return `\x1b[90m${nullStr}\x1b[0m`; // Gray for null
}

function colorKey(key: string): string {
	return `\x1b[36m${key}\x1b[0m`; // Cyan for object keys
}

function prettyJson(value: unknown): string {
	if (value === null) {
		return colorNull("null");
	}
	if (typeof value === "string") {
		return colorString(JSON.stringify(value)); // Properly escapes strings
	}
	if (typeof value === "number") {
		return colorNumber(value.toString());
	}
	if (typeof value === "boolean") {
		return colorBoolean(value.toString());
	}
	if (Array.isArray(value)) {
		const elements = value.map((el) => prettyJson(el));
		const indentedElements = elements.map((el) => `${el}`);
		return `[${indentedElements.join(",")}]`;
	}
	if (typeof value === "object") {
		const keys = Object.keys(value);
		const properties = keys.map((key) => {
			const coloredKey = colorKey(JSON.stringify(key));
			const coloredValue = prettyJson(
				(value as unknown as Record<string, unknown>)[key],
			);
			return `${coloredKey}: ${coloredValue}`;
		});
		return `{${properties.join(",")}}`;
	}
	return "unknown"; // Fallback for unsupported types
}

class ClientLogger {
	private url = "/log";
	private logBatch: Array<{
		system: string;
		level: string;
		data: unknown[];
		path: string | undefined;
		tag: string | undefined;
		time: string;
	}> = [];
	private batchTimer: NodeJS.Timeout | null;

	constructor(
		protected options: {
			path?: string;
			tag?: string;
			system?: string;
			skipStringify?: boolean;
			occurrences?: number;
			lastOccurrence?: string;
		} = { system: isBrowser ? "client" : "ssr", occurrences: 1 },
	) {
		if (isBrowser) {
			this.batchTimer = setInterval(
				() => this.flushBatch(),
				2000,
			) as unknown as NodeJS.Timeout;
		} else {
			this.batchTimer = null;
		}
	}

	info(...data: unknown[]) {
		this.sendLog("info", data);
	}

	debug(...data: unknown[]) {
		this.sendLog("debug", data);
	}

	warning(...data: unknown[]) {
		this.sendLog("warning", data);
	}

	error(...data: unknown[]) {
		this.sendLog("error", data);
	}

	public logToConsole(
		date: Date,
		level: "info" | "debug" | "warning" | "error",
		data: unknown[],
		time: string,
	) {
		const day = date.getDate();
		if (lastday !== day) {
			lastday = day;
			const log = [
				`${"\x1b[33m[internal]".padEnd(20, " ").slice(0, 20)}`,
				`${date.toLocaleDateString()}   `,
				`Logging started ${date.toISOString()}\x1b[0m`,
			];
			console.info(...log);
		}
		const colours = {
			info: "\x1b[34m", // blue
			debug: "\x1b[32m", // green
			warning: "\x1b[33m", // yellow
			error: "\x1b[31m", // red
		};
		const colour = colours[level];
		const log = [
			`${`${colour}[${this.options.system}${this.options.tag ? `:${this.options.tag}` : ""}]`.padEnd(20, " ").slice(0, 20)}\x1b[0m`,
			`\x1b[38;5;208m${time}\x1b[0m`,
			this.options.skipStringify ? data : prettyJson(data),
		];
		if (this.options.occurrences && this.options.occurrences > 1) {
			log.push(`x${this.options.occurrences}`);
		}

		switch (level) {
			case "info":
				console.info(...log);
				break;
			case "debug":
				console.debug(...log);
				break;
			case "warning":
				console.warn(...log);
				break;
			case "error":
				console.error(...log);
				break;
			default:
				console.error(...log);
				break;
		}
	}

	private async sendLog(
		level: "info" | "debug" | "warning" | "error",
		data: unknown[],
	) {
		const date = new Date();
		const hours = `${date.getHours()}`.padStart(2, "0");
		const minutes = `${date.getMinutes()}`.padStart(2, "0");
		const seconds = `${date.getSeconds()}`.padStart(2, "0");
		const milliseconds = `${date.getMilliseconds()}`.padStart(3, "0");
		const time = `${hours}:${minutes}:${seconds}.${milliseconds}`;
		if (typeof window === "undefined") {
			this.logToConsole(date, level, data, time);
			return;
		}
		const logEntry = {
			level,
			data,
			path: this.options.path,
			tag: this.options.tag,
			time,
			system: this.options.system || "app",
		};
		this.logBatch.push(logEntry);
		if (this.logBatch.length >= 10) {
			await this.flushBatch();
		}
	}

	private async flushBatch() {
		if (this.logBatch.length === 0) return;
		try {
			const response = await fetch(this.url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ batch: this.logBatch }),
			});
			if (!response.ok) {
				console.error(`Failed to log batch: ${await response.text()}`);
			}
		} catch (error) {
			console.error(
				`Error logging batch: ${error instanceof Error ? error.message : error}`,
			);
		}
		this.logBatch = [];
	}
}

export { ClientLogger };
