import type { RouteConfig } from "@react-router/dev/routes";
import { route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("onboarding", "routes/onboarding.tsx"),
  route("connections", "routes/connections/index.tsx"),
  route("connections/new", "routes/connections/new.tsx"),
  route("tax-rates", "routes/tax-rates.tsx"),
  route("tax-rates/:code", "routes/tax-rates.$code.tsx"),
  route("company", "routes/company.tsx"),
  route("tools/evaluate", "routes/tools.evaluate.tsx"),
  route("settings", "routes/settings.tsx"),
  route("test-routes", "routes/test-routes.tsx"),
  route("test-auth", "routes/test-auth.tsx"),
  route("test-create-connection", "routes/test-create-connection.tsx"),
  route("api/connections", "routes/api.connections.tsx"),
  route("api/debug/connections", "routes/api.debug.connections.tsx"),
  route("api/moneyworks", "routes/api.moneyworks.tsx"),
  route("api/moneyworks-test", "routes/api.moneyworks-test.tsx"),
] satisfies RouteConfig;