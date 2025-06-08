import { registerAdapter } from "~/modules/ide/adapter/register";
import { adapter as json } from "~/modules/json.ide/adapter/adapter";
import { adapter as openapi } from "~/modules/openapi.ide/adapter/adapter";
import { adapter as serviceconnection } from "~/modules/serviceconnection.ide/adapter/adapter";
import { apiGetAdapter as apiget } from "~/modules/api-get.ide/adapter/adapter";
import { adapter as chat } from "~/modules/chat.ide/adapter/adapter";

// Register all adapters
registerAdapter(json, json);
registerAdapter(openapi, openapi);
registerAdapter(serviceconnection, serviceconnection);
registerAdapter(apiget, apiget);
registerAdapter(chat, chat);

export { json, openapi, serviceconnection, apiget, chat };
