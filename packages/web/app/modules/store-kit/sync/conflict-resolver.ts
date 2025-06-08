/**
 * Conflict resolution system for handling concurrent edits
 */

import type { Delta } from "jsondiffpatch";
import { diff, patch } from "jsondiffpatch";

export interface Conflict {
  path: string;
  localValue: any;
  remoteValue: any;
  baseValue?: any;
}

export interface Resolution {
  path: string;
  resolvedValue: any;
  strategy: 'local' | 'remote' | 'merge' | 'custom';
}

export interface ConflictContext<T> {
  local: T;
  remote: T;
  base?: T;
  localDelta?: Delta;
  remoteDelta?: Delta;
}

export abstract class ConflictResolver<T> {
  /**
   * Detect conflicts between local and remote versions
   */
  abstract detect(context: ConflictContext<T>): Conflict[];

  /**
   * Resolve a single conflict
   */
  abstract resolve(conflict: Conflict, context: ConflictContext<T>): Resolution;

  /**
   * Apply resolutions to create the final merged state
   */
  abstract merge(context: ConflictContext<T>, resolutions: Resolution[]): T;
}

/**
 * Simple conflict resolver that uses a fixed strategy
 */
export class SimpleConflictResolver<T> extends ConflictResolver<T> {
  constructor(private strategy: 'local' | 'remote' | 'error' = 'remote') {
    super();
  }

  detect(context: ConflictContext<T>): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // If no base, can't detect conflicts properly
    if (!context.base) {
      // Simple comparison: if local !== remote, it's a conflict
      if (JSON.stringify(context.local) !== JSON.stringify(context.remote)) {
        conflicts.push({
          path: '',
          localValue: context.local,
          remoteValue: context.remote,
        });
      }
      return conflicts;
    }

    // Calculate deltas if not provided
    const localDelta = context.localDelta || diff(context.base, context.local);
    const remoteDelta = context.remoteDelta || diff(context.base, context.remote);

    if (!localDelta || !remoteDelta) {
      return conflicts;
    }

    // Detect conflicts by comparing deltas
    this.detectDeltaConflicts(localDelta, remoteDelta, '', conflicts);
    
    return conflicts;
  }

  private detectDeltaConflicts(
    localDelta: any,
    remoteDelta: any,
    path: string,
    conflicts: Conflict[]
  ): void {
    // If both deltas modify the same path, it's a conflict
    for (const key in localDelta) {
      if (key in remoteDelta) {
        const newPath = path ? `${path}.${key}` : key;
        
        // Check if it's the same change
        if (JSON.stringify(localDelta[key]) !== JSON.stringify(remoteDelta[key])) {
          conflicts.push({
            path: newPath,
            localValue: localDelta[key],
            remoteValue: remoteDelta[key],
          });
        }
      }
    }
  }

  resolve(conflict: Conflict, context: ConflictContext<T>): Resolution {
    if (this.strategy === 'error') {
      throw new Error(`Conflict detected at path: ${conflict.path}`);
    }

    return {
      path: conflict.path,
      resolvedValue: this.strategy === 'local' ? conflict.localValue : conflict.remoteValue,
      strategy: this.strategy,
    };
  }

  merge(context: ConflictContext<T>, resolutions: Resolution[]): T {
    // For simple resolver, just return the chosen version
    if (this.strategy === 'local') {
      return context.local;
    } else if (this.strategy === 'remote') {
      return context.remote;
    }
    
    // Should not reach here if strategy is 'error'
    throw new Error('Invalid merge state');
  }
}

/**
 * Advanced conflict resolver with field-level merging
 */
export class FieldLevelConflictResolver<T> extends ConflictResolver<T> {
  constructor(
    private fieldStrategies: Record<string, 'local' | 'remote' | 'merge'> = {}
  ) {
    super();
  }

  detect(context: ConflictContext<T>): Conflict[] {
    const conflicts: Conflict[] = [];
    this.detectFieldConflicts(
      context.local,
      context.remote,
      context.base,
      '',
      conflicts
    );
    return conflicts;
  }

  private detectFieldConflicts(
    local: any,
    remote: any,
    base: any,
    path: string,
    conflicts: Conflict[]
  ): void {
    // Handle primitives
    if (typeof local !== 'object' || typeof remote !== 'object') {
      if (local !== remote) {
        const baseValue = base !== undefined ? base : undefined;
        if (baseValue !== undefined && local !== baseValue && remote !== baseValue) {
          conflicts.push({
            path,
            localValue: local,
            remoteValue: remote,
            baseValue,
          });
        }
      }
      return;
    }

    // Handle objects
    const allKeys = new Set([
      ...Object.keys(local || {}),
      ...Object.keys(remote || {}),
    ]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      const localValue = local?.[key];
      const remoteValue = remote?.[key];
      const baseValue = base?.[key];

      if (localValue !== remoteValue) {
        if (baseValue !== undefined) {
          // Three-way comparison
          if (localValue !== baseValue && remoteValue !== baseValue) {
            conflicts.push({
              path: newPath,
              localValue,
              remoteValue,
              baseValue,
            });
          }
        } else {
          // Two-way comparison
          conflicts.push({
            path: newPath,
            localValue,
            remoteValue,
          });
        }
      }

      // Recurse for nested objects
      if (typeof localValue === 'object' && typeof remoteValue === 'object') {
        this.detectFieldConflicts(
          localValue,
          remoteValue,
          baseValue,
          newPath,
          conflicts
        );
      }
    }
  }

  resolve(conflict: Conflict, context: ConflictContext<T>): Resolution {
    const strategy = this.fieldStrategies[conflict.path] || 'remote';

    if (strategy === 'merge' && conflict.baseValue !== undefined) {
      // Implement custom merge logic based on field type
      const resolvedValue = this.mergeField(
        conflict.localValue,
        conflict.remoteValue,
        conflict.baseValue
      );
      
      return {
        path: conflict.path,
        resolvedValue,
        strategy: 'merge',
      };
    }

    return {
      path: conflict.path,
      resolvedValue: strategy === 'local' ? conflict.localValue : conflict.remoteValue,
      strategy,
    };
  }

  private mergeField(local: any, remote: any, base: any): any {
    // Example: merge arrays by combining unique values
    if (Array.isArray(local) && Array.isArray(remote) && Array.isArray(base)) {
      const added = new Set([
        ...local.filter(item => !base.includes(item)),
        ...remote.filter(item => !base.includes(item)),
      ]);
      const removed = new Set(base.filter(item => !local.includes(item) && !remote.includes(item)));
      
      return base.filter(item => !removed.has(item)).concat(Array.from(added));
    }

    // For other types, prefer remote by default
    return remote;
  }

  merge(context: ConflictContext<T>, resolutions: Resolution[]): T {
    let result = JSON.parse(JSON.stringify(context.base || context.remote));

    // Apply resolutions
    for (const resolution of resolutions) {
      this.setValueAtPath(result, resolution.path, resolution.resolvedValue);
    }

    return result;
  }

  private setValueAtPath(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }
}

/**
 * Factory for creating conflict resolvers
 */
export function createConflictResolver<T>(
  type: 'simple' | 'field-level',
  options?: any
): ConflictResolver<T> {
  switch (type) {
    case 'simple':
      return new SimpleConflictResolver<T>(options?.strategy);
    case 'field-level':
      return new FieldLevelConflictResolver<T>(options?.fieldStrategies);
    default:
      throw new Error(`Unknown conflict resolver type: ${type}`);
  }
}