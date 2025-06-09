// Non-hook subscription functions
export {
  subscribeToContextUpdates,
  subscribeToMultipleContexts,
  createManagedContextSubscription,
} from "./subscribe";

// React hooks
export {
  useContextSubscription,
  useMultipleContextSubscriptions,
} from "./use-context-subscription";

// Types
export type {
  ContextUpdateEvent,
  ContextSubscriptionOptions,
} from "./subscribe";

export type {
  UseContextSubscriptionOptions,
} from "./use-context-subscription";