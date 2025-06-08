import { useContext } from "react";
import { ProjectStoreContext } from "~/modules/ide/provider/types";
import { config } from "~/modules/ide/adapter/config";

export const useProjectContext = () => {
  const context = useContext(ProjectStoreContext);
  if (!context) {
    throw new Error(
      `${config.type} store context must be used within a ${config.type}StoreContext.Provider with id ${config.type}StoreContext.Provider{ id: "${config.type}"`,
    );
  }
  return context;
};
