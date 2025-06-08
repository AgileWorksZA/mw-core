import {useParams} from "react-router";
import {useIdeSelector} from "~/modules/ide/hooks/use-ide-selector";

export function useManifest(idArg?: string) {
  const idParam = useParams().id as string;
  const id = idArg || idParam;
  return useIdeSelector((state) => {
    const file = state.context.files[id];
    if (!file) {
      throw new Error(`Manifest with id ${id} not found`);
    }
    return file;
  });
}