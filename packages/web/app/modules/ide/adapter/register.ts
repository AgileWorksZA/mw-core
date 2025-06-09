import { useParams } from "react-router";
import type { AdapterCategory } from "./categories";
import { isValidCategory } from "./categories";
import type { Adapter, AdapterConfig, AdapterLogic } from "./type";

const registry: Record<string, Adapter> = {};

export function registerAdapter<TContext, I, O>(
	config: AdapterConfig,
	logic: AdapterLogic<TContext, I, O>,
) {
	// Check if the adapter type is already registered
	if (registry[config.type]) {
		console.warn(`Adapter type ${config.type} is already registered.`);
		return registry[config.type] as Adapter<TContext, I, O>;
	}

	// Validate category if provided
	if (config.metadata?.category && !isValidCategory(config.metadata.category)) {
		console.warn(
			`Invalid category '${config.metadata.category}' for adapter ${config.type}`,
		);
	}

	// Register the adapter
	registry[config.type] = { ...config, ...logic } as Adapter;

	// Log the registration
	console.log(`Adapter ${config.type} registered.`);
	return registry[config.type] as Adapter<TContext, I, O>;
}

export function getAdapter<TContext, I extends object, O extends object>(
	type: string,
): Adapter<TContext, I, O> {
	const adapter = registry[type];
	if (!adapter) {
		console.warn(`Adapter type ${type} is not registered.`);
		throw new Error(`Adapter type ${type} is not registered.`);
	}
	return adapter as Adapter<TContext, I, O>;
}

export function useAdapter<TContext, I extends object, O extends object>(
	adapter?: string,
): Adapter<TContext, I, O> {
	const param = useParams().type;
	const type = adapter || param;
	if (!type) {
		console.warn("No adapter type provided.");
		throw new Error("No adapter type provided.");
	}
	const result = getAdapter<TContext, I, O>(type);
	if (!result) {
		console.warn(`Adapter type ${type} is not registered.`);
		throw new Error(`Adapter type ${type} is not registered.`);
	}
	return result;
}

export function listAdapters() {
	return Object.keys(registry).map((key) => ({
		...registry[key],
	}));
}

/**
 * List adapters filtered by category
 */
export function listAdaptersByCategory(category: AdapterCategory) {
	return listAdapters().filter(
		(adapter) => adapter.metadata?.category === category,
	);
}

/**
 * List adapters filtered by tags
 */
export function listAdaptersByTags(tags: string[]) {
	return listAdapters().filter((adapter) => {
		if (!adapter.metadata?.tags) return false;
		return tags.some((tag) => adapter.metadata?.tags?.includes(tag));
	});
}

/**
 * Get adapter metadata
 */
export function getAdapterMetadata(type: string) {
	const adapter = registry[type];
	if (!adapter) return null;

	return {
		type: adapter.type,
		name: adapter.metadata?.name || adapter.type,
		description: adapter.metadata?.description,
		category: adapter.metadata?.category,
		tags: adapter.metadata?.tags || [],
		acceptedFiles: adapter.metadata?.accept || [],
	};
}

/**
 * Check if a file type is accepted by any adapter
 */
export function findAdaptersForFileType(extension: string) {
	return listAdapters().filter((adapter) => {
		if (!adapter.metadata?.accept) return false;
		return adapter.metadata.accept.includes(extension);
	});
}

// Example:
// import type { Context } from "~/modules/json.ide";
// const adapter = getAdapter<Context>("json");
// adapter.useJsonFileSelector( s => s.context.data);
