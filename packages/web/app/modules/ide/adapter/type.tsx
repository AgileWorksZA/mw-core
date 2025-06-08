import type {
  FC,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import type { FileContext, Variables } from "~/modules/ide/types";
import type { JSONSchemaType } from "ajv";
import type { LucideProps } from "lucide-react";
import type { StoreSnapshot } from "@xstate/store";
import type { AdapterCategory } from "./categories";

export interface AdapterConfig {
  type: string; // The type of the adapter
  metadata?: {
    name?: string;
    description?: string;
    tags?: string[];
    category?: AdapterCategory;
    accept?: string[]; // File types accepted for drop/upload (e.g. ['.json', '.yaml'])
  };
}

export interface AdapterLogic<
  TContext,
  I,
  O,
  TInput extends Variables<I> = Variables<I>,
  TOutput extends Variables<O> = Variables<O>,
> {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >; // The icon to be used for the adapter
  // When we are on a "new state", the first things we need is an empty context.
  emptyContext: () => FileContext<TContext> | Promise<FileContext<TContext>>; // Function to create a new file
  // When a file is available, we can do additional setting up using the file
  createFromFile?: (props: {
    path: string;
    file: File;
    context: FileContext<TContext>;
  }) => FileContext<TContext> | Promise<FileContext<TContext>>; // Function to handle file input
  calculateOutputs: (props: {
    input: {
      variables: TInput;
      schema?: JSONSchemaType<TInput>;
    };
    context: TContext;
  }) => {
    variables: TOutput | TInput | null;
    schema?: JSONSchemaType<TOutput>;
  }; // Function to update the output of the adapter based on the input
  useSelector: <TState>(
    selector: (snapshot: StoreSnapshot<TContext>) => TState,
  ) => TState; // Function to get the store of the adapter
  QuickView?: (props: {
    file: FileContext<TContext>;
  }) => ReactNode; // Function to render a quick view of the adapter. If not provided, we'll use the default one
  Editor?: FC; // Function to render the editor of the adapter
  NewFile?: () => ReactNode; // We'll use standard "new dialogs or screens", but here the adapter can provide a custom one
  DeleteFile?: () => ReactNode; // We'll use standard "delete dialogs or screens", but here the adapter can provide a custom one
  Provider: (props: { children?: ReactNode }) => ReactNode; // The provider to be used for the adapter
}

export type Adapter<TContext = any, I = any, O = any> = AdapterConfig &
  AdapterLogic<TContext, I, O>;
