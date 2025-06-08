# React Router Context7 Documentation

Last updated: 2025-05-18

## Library Information
- **Library ID**: /remix-run/react-router
- **Description**: Declarative routing for React
- **Code Snippets**: 723
- **Trust Score**: 7.5

## Key Usage Patterns

### Basic Setup with BrowserRouter
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);
```

### Data Router with createBrowserRouter
```tsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    loader: loadRootData,
  },
]);

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
);
```

### Common Hooks

#### useNavigate
```tsx
import { useNavigate } from "react-router";

export function useLogoutAfterInactivity() {
  let navigate = useNavigate();

  useFakeInactivityHook(() => {
    navigate("/logout");
  });
}
```

#### useParams
```tsx
import { useParams } from "react-router";

export default function Post() {
  let params = useParams();
  return <h1>Post: {params.postId}</h1>;
}
```

#### useLocation
```tsx
import { useLocation } from "react-router";

function SomeComponent() {
  let location = useLocation();

  React.useEffect(() => {
    ga('send', 'pageview');
  }, [location]);
}
```

#### useLoaderData
```tsx
import { useLoaderData } from "react-router";

function MyRoute() {
  let data = useLoaderData();
  return <h1>{data.message}</h1>;
}
```

### Navigation Components

#### Link
```tsx
import { Link } from "react-router";

<Link to="/dashboard">Dashboard</Link>

<Link
  to={{
    pathname: "/some/path",
    search: "?query=string",
    hash: "#hash",
  }}
/>
```

#### NavLink
```tsx
import { NavLink } from "react-router";

export function MyAppNav() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/trending" end>
        Trending Concerts
      </NavLink>
      <NavLink to="/concerts">All Concerts</NavLink>
      <NavLink to="/account">Account</NavLink>
    </nav>
  );
}
```

### Advanced Patterns

#### Fetchers
```tsx
import { useFetcher } from "react-router";

function SomeComponent() {
  let fetcher = useFetcher();

  // states are available on the fetcher
  fetcher.state // "idle" | "loading" | "submitting"
  fetcher.data // the data returned from the action or loader

  // render a form
  <fetcher.Form method="post" />

  // load data
  fetcher.load("/some/route")

  // submit data
  fetcher.submit(someFormRef, { method: "post" })
  fetcher.submit(someData, {
    method: "post",
    encType: "application/json"
  })
}
```

#### Outlet for Nested Routes
```tsx
import { Outlet } from "react-router";

export default function SomeParent() {
  return (
    <div>
      <h1>Parent Content</h1>
      <Outlet />
    </div>
  );
}
```

### Best Practices for this Project

1. Use data routers (createBrowserRouter) for better type safety
2. Prefer hooks over imperative APIs
3. Use type-safe loader patterns:
   ```tsx
   import type { loader } from "../routes/project-ide";
   const { data } = useLoaderData<typeof loader>();
   ```
4. Utilize the document-context module instead of zustand for state management
5. Check for runtime errors and compilation issues after implementing routes