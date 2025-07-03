import { useMemo } from "react";
import { useConnection } from "~/contexts/connection-context";
import { MoneyWorksRESTClient } from "@moneyworks/data";

export function useMoneyWorks() {
  const { currentConnection } = useConnection();
  
  const client = useMemo(() => {
    if (!currentConnection) return null;
    
    const config: any = {
      host: currentConnection.mw_host,
      port: currentConnection.mw_port,
      dataFile: currentConnection.mw_data_file,
      username: currentConnection.mw_username,
      password: currentConnection.mw_password,
    };
    
    // Add folder auth if present
    if (currentConnection.mw_folder_name && currentConnection.mw_folder_password) {
      config.folderAuth = {
        folderName: currentConnection.mw_folder_name,
        folderPassword: currentConnection.mw_folder_password
      };
    }
    
    return new MoneyWorksRESTClient(config);
  }, [currentConnection]);
  
  return { client, currentConnection };
}