import { useApiGetContext } from "./use-api-get-context";

export function useApiGetSelector() {
  const store = useApiGetContext();
  return store.useSelector;
}

export function useApiGetDataSelector() {
  const store = useApiGetContext();
  return store.useSelector((state) => state.context.data);
}