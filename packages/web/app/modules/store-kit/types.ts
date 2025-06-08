/** Types for StoreKit */

import type { EventObject, Store } from "@xstate/store";
import { createStoreWithProducer } from "@xstate/store";
import { create } from "mutative";
import { useMemo } from "react";

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;
type AllKeys<T> = T extends any ? keyof T : never;
type EmitterFunction<TEmittedEvent extends EventObject> = (
  ...args: {
    type: TEmittedEvent["type"];
  } extends TEmittedEvent
    ? AllKeys<TEmittedEvent> extends "type"
      ? []
      : [DistributiveOmit<TEmittedEvent, "type">?]
    : [DistributiveOmit<TEmittedEvent, "type">]
) => void;

export type EnqueueObject<TEmittedEvent extends EventObject> = {
  emit: {
    [E in TEmittedEvent as E["type"]]: EmitterFunction<E>;
  };
  effect: (fn: () => void) => void;
};

export type StoreContext = Record<string, any>;

export type StoreKitEvents<TEventPayloadsBase> = {
  [K in keyof TEventPayloadsBase]: TEventPayloadsBase[K] & {
    type: K & string;
  };
}[keyof TEventPayloadsBase];

export type StoreKitEmitted<TEmittedPayloadsBase> = {
  [K in keyof TEmittedPayloadsBase]: TEmittedPayloadsBase[K] extends undefined
    ? { type: K & string }
    : TEmittedPayloadsBase[K] & { type: K & string };
}[keyof TEmittedPayloadsBase];

/** StoreKit type compatible with @xstate/store */
export type StoreKit<
  TContext extends StoreContext,
  TEventPayloadsBase,
  TEmittedPayloadsBase,
  TEvents extends EventObject = StoreKitEvents<TEventPayloadsBase>,
  TEmittedPayloads extends EventObject = StoreKitEmitted<TEmittedPayloadsBase>,
> = Store<TContext, TEvents, TEmittedPayloads>;

type EventHandlerReturnType<TContext extends StoreContext> =
  | TContext
  | void
  | Promise<TContext>
  | Promise<void>;

/** Event handlers type for createStoreWithProducer */
export type EventHandlers<
  TContext extends StoreContext,
  TEventPayloadsBase,
  TEmittedPayloadsBase,
> = {
  [K in keyof TEventPayloadsBase]: (
    context: TContext,
    event: TEventPayloadsBase[K] & { type: K },
    enqueue: EnqueueObject<StoreKitEmitted<TEmittedPayloadsBase>>,
  ) => EventHandlerReturnType<TContext>;
};

/** Emit handlers type for createStoreWithProducer */
export type EmitHandlers<TEmittedPayloadsBase> = {
  [K in keyof TEmittedPayloadsBase]: () => void;
};

/** CreateStoreKitFunction is a function that returns a StoreKit */
export type CreateStoreKitFunction<
  TContext extends StoreContext,
  TEventPayloadsBase,
  TEmittedPayloadsBase,
> = (props: {
  store: {
    context: TContext;
    on: EventHandlers<TContext, TEventPayloadsBase, TEmittedPayloadsBase>;
    emits: EmitHandlers<TEmittedPayloadsBase>;
  };
}) => StoreKit<TContext, TEventPayloadsBase, TEmittedPayloadsBase>;

export function useCreateStoreKit<
  TContext extends StoreContext,
  TEventPayloadsBase,
  TEmittedPayloadsBase,
>(storeKit: {
  context: TContext;
  on: EventHandlers<TContext, TEventPayloadsBase, TEmittedPayloadsBase>;
  emits: EmitHandlers<TEmittedPayloadsBase>;
}) {
  return useMemo(() => {
    return createStoreWithProducer(create, storeKit as any) as StoreKit<
      TContext,
      TEventPayloadsBase,
      TEmittedPayloadsBase
    >;
  }, [storeKit]);
}
