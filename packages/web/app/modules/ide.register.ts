import { adapter as chat } from "~/modules/chat.ide/adapter/adapter";
import { registerAdapter } from "~/modules/ide/adapter/register";
import { adapter as json } from "~/modules/json.ide/adapter/adapter";
import { adapter as openapi } from "~/modules/openapi.ide/adapter/adapter";
import { adapter as serviceConnection } from "~/modules/serviceconnection.ide/adapter/adapter";

// Register all adapters
registerAdapter(json, json);
registerAdapter(openapi, openapi);
registerAdapter(serviceConnection, serviceConnection);
registerAdapter(chat, chat);

export { json, openapi, serviceConnection, chat };
