import { useServiceConnectionDataContext } from "~/modules/serviceconnection.ide/hooks/use-serviceconnection-context";

export function useServiceConnectionDataTrigger() {
  const { store } = useServiceConnectionDataContext();
  return store.send;
}