import { createContext } from "react";
import type { ProjectStoreKit } from "~/modules/ide/provider/store/types";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export type ProjectStoreContextType = {
  store: ProjectStoreKit;
  cursor: VersionCursor;
};

export const ProjectStoreContext =
  createContext<ProjectStoreContextType | null>(null);
