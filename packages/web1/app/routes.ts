import type { RouteConfig } from "@react-router/dev/routes";
import { route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("tax-rates", "routes/tax-rates.tsx"),
  route("tax-rates/:code", "routes/tax-rates.$code.tsx"),
  route("company", "routes/company.tsx"),
  route("tools/evaluate", "routes/tools.evaluate.tsx"),
  route("settings", "routes/settings.tsx"),
] satisfies RouteConfig;