import { EventEmitter } from "node:events";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export interface StorageUpdateEvent {
  type: string;
  id: string;
  cursor: VersionCursor;
  sessionId?: string;
  timestamp: number;
  operation: "write" | "delete" | "replace";
  context?: any;
  delta?: any;
}

class StorageEventEmitter extends EventEmitter {
  private static instance: StorageEventEmitter;

  private constructor() {
    super();
    // Set max listeners to handle multiple SSE connections
    this.setMaxListeners(100);
  }

  static getInstance(): StorageEventEmitter {
    if (!StorageEventEmitter.instance) {
      StorageEventEmitter.instance = new StorageEventEmitter();
    }
    return StorageEventEmitter.instance;
  }

  /**
   * Emit a storage update event
   */
  emitUpdate(event: StorageUpdateEvent) {
    const channel = `${event.type}/${event.id}`;
    this.emit(channel, event);
    
    // Also emit to a wildcard channel for type-level subscriptions
    this.emit(`${event.type}/*`, event);
    
    // And a global channel for all updates
    this.emit("*", event);
  }

  /**
   * Subscribe to updates for a specific document
   */
  subscribeToDocument(type: string, id: string, listener: (event: StorageUpdateEvent) => void) {
    const channel = `${type}/${id}`;
    this.on(channel, listener);
    
    return () => {
      this.off(channel, listener);
    };
  }

  /**
   * Subscribe to updates for all documents of a type
   */
  subscribeToType(type: string, listener: (event: StorageUpdateEvent) => void) {
    const channel = `${type}/*`;
    this.on(channel, listener);
    
    return () => {
      this.off(channel, listener);
    };
  }

  /**
   * Subscribe to all storage updates
   */
  subscribeToAll(listener: (event: StorageUpdateEvent) => void) {
    this.on("*", listener);
    
    return () => {
      this.off("*", listener);
    };
  }
}

// Export singleton instance
export const storageEvents = StorageEventEmitter.getInstance();