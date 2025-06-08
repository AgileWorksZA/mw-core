import type { ColumnDef } from "@tanstack/react-table";
import { createStoreWithProducer } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { create, rawReturn } from "mutative";
import type { OpenAPIV3 } from "openapi-types";

export type SchemaMetaProperties = {
  type: string;
  format?: string;
  required: boolean;
  nullable: boolean;
  description?: string;
  enum?: (string | number)[];
  groupId?: string; // Reference to column group
};

export type SchemaProperties = Record<string, SchemaMetaProperties>;

export type ColumnGroup = {
  id: string;
  name: string;
  description?: string;
};

export interface IDesignerProps {
  url: string;
  documentation?: OpenAPIV3.Document;
  method?: string;
  schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
  properties?: SchemaProperties;
  paths: {
    data: string;
    pagination: string;
  };
  columns: ColumnDef<unknown>[];
  columnGroups: ColumnGroup[];
  apiData?: unknown;
  apiUrl?: string;
  error?: string | null;
  idField?: string; // Identifies which column is the primary key/ID field
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  sorting: { id: string; desc: boolean }[]; // Current sorting state
  designerState: {
    selectedProperty?: string;
  };
}

const DefaultContext: IDesignerProps = {
  url: "http://localhost:5173/test-openapi.json",
  paths: {
    data: "data",
    pagination: "pagination",
  },
  columns: [],
  columnGroups: [],
  idField: "",
  pagination: {
    limit: 10,
    offset: 0,
    total: 0,
  },
  sorting: [],
  designerState: {},
};

export const DesignerContext = createStoreWithProducer(create, {
  context: JSON.parse(JSON.stringify(DefaultContext)),
  emits: {},
  on: {
    reset: () => {
      return rawReturn(JSON.parse(JSON.stringify(DefaultContext)));
    },
    update: (context, event: { update: Partial<IDesignerProps> }) => {
      return {
        ...context,
        ...event.update,
      };
    },
  },
});

export function useDesigner<T>(
  selector: (snapshot: {
    status: string;
    context: IDesignerProps;
    output?: unknown;
    error?: unknown;
  }) => T,
  compare?: (prev: T | undefined, next: T) => boolean,
) {
  return useSelector(DesignerContext, selector, compare);
}
