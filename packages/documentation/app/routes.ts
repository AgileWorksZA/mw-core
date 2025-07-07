import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("test", "routes/test.tsx"),
  
  // Package documentation
  route("packages", "routes/packages._index.tsx"),
  route("packages/:pkg", "routes/packages.$pkg.tsx"),
  route("packages/:pkg/api", "routes/packages.$pkg.api.tsx"),
  
  // Guides
  route("guides", "routes/guides._index.tsx"),
  route("guides/:guide", "routes/guides.$guide.tsx"),
  
  // API Reference
  route("api", "routes/api._index.tsx"),
  route("api/:pkg/:method", "routes/api.$pkg.$method.tsx"),
  
  // Search
  route("search", "routes/search.tsx"),
  
  // API routes
  route("api/preferences", "routes/api.preferences.tsx"),
] satisfies RouteConfig;
