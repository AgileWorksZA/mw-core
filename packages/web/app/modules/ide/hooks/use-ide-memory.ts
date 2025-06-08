import {useIde} from "~/modules/ide/hooks/use-ide";

function useIdeMemory() {
  return JSON.stringify(useIde()).length;
}

export {useIdeMemory};