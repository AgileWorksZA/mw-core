import {useIdeSelector} from "~/modules/ide/hooks/use-ide-selector";

export function useIde() {
  return useIdeSelector((state) => state.context);
}