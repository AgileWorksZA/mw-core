import { data as json, type ActionFunctionArgs } from "react-router";
import { connectionService } from "~/services/connections";
import { SmartMoneyWorksClient } from "@moneyworks/data";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const connectionId = formData.get("connectionId") as string;
  const operation = formData.get("operation") as string;
  const table = formData.get("table") as string;
  let options = {};
  try {
    const optionsString = formData.get("options") as string;
    if (optionsString) {
      options = JSON.parse(optionsString);
    }
  } catch (err) {
    console.error("[API MoneyWorks] Failed to parse options:", err);
  }
  
  // console.log("[API MoneyWorks] Request:", {
  //   userId,
  //   connectionId,
  //   operation,
  //   table,
  //   options
  // });
  
  if (!userId || !connectionId) {
    return json({ error: "Missing required parameters" }, { status: 400 });
  }
  
  try {
    // Get the connection details
    const connection = await connectionService.getConnection(userId, connectionId);
    if (!connection) {
      return json({ error: "Connection not found" }, { status: 404 });
    }
    
    // Log connection info (commented out to reduce verbosity)
    // console.log("[API MoneyWorks] Connection found:", {
    //   host: connection.mw_host,
    //   port: connection.mw_port,
    //   dataFile: connection.mw_data_file,
    //   username: connection.mw_username ? "[SET]" : "[NOT SET]"
    // });
    
    // Create MoneyWorks client
    const clientConfig: any = {
      host: connection.mw_host,
      port: connection.mw_port,
      dataFile: connection.mw_data_file,
      username: connection.mw_username,
      password: connection.mw_password,
      debug: false
    };
    
    // Add folder auth if present
    if (connection.mw_folder_name && connection.mw_folder_password) {
      clientConfig.folderAuth = {
        folderName: connection.mw_folder_name,
        folderPassword: connection.mw_folder_password
      };
    }
    
    const client = new SmartMoneyWorksClient(clientConfig);
    
    // Perform the requested operation
    let result;
    switch (operation) {
      case "export":
        // console.log("[API MoneyWorks] Calling export with:", { table, options });
        // If format is "json", use smartExport to get objects
        if (options.format === "json") {
          const { format, ...restOptions } = options;
          console.log("[API MoneyWorks] Using smartExport for JSON format");
          result = await client.smartExport(table, {
            ...restOptions,
            exportFormat: 'full' // Get full objects
          });
          console.log("[API MoneyWorks] SmartExport result:", { 
            type: typeof result,
            isArray: Array.isArray(result),
            length: Array.isArray(result) ? result.length : undefined,
            sample: Array.isArray(result) && result.length > 0 ? result[0] : undefined
          });
        } else {
          result = await client.export(table, options);
        }
        // console.log("[API MoneyWorks] Export result:", { 
        //   type: typeof result,
        //   isArray: Array.isArray(result),
        //   length: Array.isArray(result) ? result.length : undefined,
        //   sample: Array.isArray(result) && result.length > 0 ? result[0] : 
        //           typeof result === 'string' ? result.substring(0, 200) : result
        // });
        break;
      case "import":
        const data = formData.get("data");
        const dataArray = data ? JSON.parse(data as string) : [];
        result = await client.import(table, dataArray, options);
        break;
      case "evaluate":
        const expression = formData.get("expression") as string;
        result = await client.evaluate(expression);
        break;
      default:
        return json({ error: "Invalid operation" }, { status: 400 });
    }
    
    return json({ success: true, data: result });
  } catch (error) {
    console.error("MoneyWorks API error:", error);
    return json({ 
      error: error instanceof Error ? error.message : "Operation failed",
      details: error
    }, { status: 500 });
  }
}