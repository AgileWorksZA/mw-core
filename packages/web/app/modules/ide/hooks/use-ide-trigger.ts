import {useProjectContext} from "~/modules/ide/hooks/use-project-context";

const useIdeTrigger = () => {
  return useProjectContext().store.trigger;
};
export {useIdeTrigger};