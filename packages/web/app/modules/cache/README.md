# Cache Module

A utility module for caching remote resources locally to improve performance and enable offline capabilities.

## Overview

The Cache module provides a system for:
- Fetching and storing remote resources locally
- Serving cached versions when offline or for better performance
- Managing cache invalidation and updates

## Key Components

### Server-Side Caching

The `cache.server.ts` utility provides server-side caching functionality:

```tsx
import { cacheUrl } from "~/modules/cache/utils/cache.server";

// Fetch and cache a remote resource
const response = await cacheUrl("https://example.com/api/data.json");

// Force refresh the cache
const refreshedResponse = await cacheUrl("https://example.com/api/data.json", true);
```

### API Routes

The module includes API routes for cache management:

- `api.cache.$.ts` - API route for accessing and manipulating the cache

## Usage

### Basic Caching

To cache a remote URL and retrieve either the cached or fresh content:

```tsx
import { cacheUrl } from "~/modules/cache/utils/cache.server";

export const loader = async () => {
  // Will fetch and cache the first time, then serve from cache subsequently
  const response = await cacheUrl("https://example.com/api/data.json");
  const data = await response.json();
  
  return { data };
};
```

### Force Cache Refresh

To force a refresh of the cached content:

```tsx
// The second parameter forces a refresh regardless of existing cache
const response = await cacheUrl("https://example.com/api/data.json", true);
```

### Cache Location

Cached files are stored in:
- `./public/specs/` directory (actual location in code)
- Filenames are sanitized versions of the URLs
- Format: `./public/specs/https___example_com_api_data_json.data`

## Implementation Details

The cache stores the complete response information:
- Response body content
- HTTP headers
- Status code
- Status text

This allows for accurate reconstruction of the original response when serving from cache.

## Integration

This module is primarily used for:
1. Caching remote OpenAPI specifications
2. Storing external resources for offline access
3. Improving performance by reducing network requests

It's recommended to use this module whenever fetching remote resources that don't change frequently or when offline access is required.