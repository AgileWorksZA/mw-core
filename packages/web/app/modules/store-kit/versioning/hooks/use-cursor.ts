import {validateParams} from "~/modules/store-kit/versioning/utils";
import {useSelector} from "@xstate/store/react";
import {versionStore} from "~/modules/store-kit/versioning/store";

/**
 * Hook to access the version information for a document
 *
 * @param name Document type name
 * @param id Document identifier
 * @returns Document version information including cursor for history navigation
 */
export function useCursor(name: string, id: string) {
  validateParams(name, {}, id);
  return useSelector(versionStore, (state) => {
    return state.context[`store-${name}-${id}`];
  });
}