import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("api/test", "routes/api.test.ts"),
] satisfies RouteConfig;
