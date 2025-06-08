"use strict";
/**
 * Test fixtures for internal types testing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.edgeCases = exports.outputConfigurations = exports.testFiles = exports.complexStructure = exports.circularReferences = exports.chainedPointers = exports.basicInternalTypes = void 0;
// Basic internal type examples
exports.basicInternalTypes = {
    pointer: {
        internal: "pointer",
        type: "json",
        id: "config-file",
        path: "settings/apiUrl",
    },
    parameter: {
        internal: "parameter",
        id: "user-id",
        name: "userId",
        schema: { type: "string" },
    },
    fromData: {
        internal: "from-data",
        path: "baseUrl",
        schema: { type: "string" },
    },
    projectVariable: {
        internal: "project-variable",
        key: "API_VERSION",
    },
    projectSecret: {
        internal: "project-secret",
        key: "API_KEY",
    },
};
// Chained pointer examples
exports.chainedPointers = {
    // Level 1 points to Level 2
    level1: {
        internal: "pointer",
        type: "json",
        id: "level2-config",
        path: "nextLevel",
    },
    // Level 2 points to Level 3
    level2Config: {
        nextLevel: {
            internal: "pointer",
            type: "json",
            id: "level3-config",
            path: "finalValue",
        },
    },
    // Level 3 has the actual value
    level3Config: {
        finalValue: "Successfully resolved through 3 levels!",
    },
};
// Circular reference examples
exports.circularReferences = {
    fileA: {
        type: "json",
        id: "circular-a",
        path: "/circular-a.json",
        mapping: {
            input: { variables: {} },
            output: {
                variables: {
                    value: {
                        internal: "pointer",
                        type: "json",
                        id: "circular-b",
                        path: "value",
                    },
                },
            },
        },
    },
    fileB: {
        type: "json",
        id: "circular-b",
        path: "/circular-b.json",
        mapping: {
            input: { variables: {} },
            output: {
                variables: {
                    value: {
                        internal: "pointer",
                        type: "json",
                        id: "circular-a",
                        path: "value",
                    },
                },
            },
        },
    },
};
// Complex nested structure with multiple internal types
exports.complexStructure = {
    apiConfig: {
        endpoints: {
            users: {
                url: {
                    internal: "pointer",
                    type: "json",
                    id: "endpoints-config",
                    path: "users/baseUrl",
                },
                headers: {
                    Authorization: {
                        internal: "project-secret",
                        key: "bearer_token",
                    },
                    "X-API-Version": {
                        internal: "project-variable",
                        key: "api_version",
                    },
                },
                params: {
                    limit: {
                        internal: "parameter",
                        id: "limit-param",
                        name: "limit",
                        schema: { type: "number", default: 10 },
                    },
                    offset: {
                        internal: "parameter",
                        id: "offset-param",
                        name: "offset",
                        schema: { type: "number", default: 0 },
                    },
                },
            },
            posts: {
                url: {
                    internal: "from-data",
                    path: "postsEndpoint",
                    schema: { type: "string" },
                },
                cache: {
                    internal: "pointer",
                    type: "json",
                    id: "cache-config",
                    path: "posts/ttl",
                },
            },
        },
        globalSettings: {
            timeout: 5000,
            retries: 3,
            environment: {
                internal: "project-variable",
                key: "environment",
                environmentId: "production",
            },
        },
    },
};
// Test files for resolution context
exports.testFiles = {
    json: {
        "config-main": {
            type: "json",
            id: "config-main",
            path: "/config-main.json",
            mapping: {
                input: { variables: {} },
                output: {
                    variables: {
                        apiUrl: "https://api.example.com",
                        apiVersion: "v2",
                        features: {
                            caching: true,
                            logging: false,
                            rateLimit: 100,
                        },
                        endpoints: {
                            users: "/users",
                            posts: "/posts",
                            comments: "/comments",
                        },
                    },
                },
            },
        },
        "cache-config": {
            type: "json",
            id: "cache-config",
            path: "/cache-config.json",
            mapping: {
                input: { variables: {} },
                output: {
                    variables: {
                        posts: {
                            ttl: 3600,
                            maxSize: 1000,
                        },
                        users: {
                            ttl: 7200,
                            maxSize: 500,
                        },
                    },
                },
            },
        },
    },
    "api-get": {
        "users-endpoint": {
            type: "api-get",
            id: "users-endpoint",
            path: "/users-endpoint.json",
            mapping: {
                input: {
                    variables: {
                        baseUrl: {
                            internal: "pointer",
                            type: "json",
                            id: "config-main",
                            path: "apiUrl",
                        },
                        endpoint: {
                            internal: "pointer",
                            type: "json",
                            id: "config-main",
                            path: "endpoints/users",
                        },
                    },
                },
                output: {
                    variables: {
                        users: [
                            { id: 1, name: "John Doe", email: "john@example.com" },
                            { id: 2, name: "Jane Smith", email: "jane@example.com" },
                            { id: 3, name: "Bob Johnson", email: "bob@example.com" },
                        ],
                        total: 3,
                        page: 1,
                        pageSize: 10,
                    },
                },
            },
        },
    },
};
// Different output configurations
exports.outputConfigurations = {
    noOutput: {
        type: "json",
        id: "no-output",
        path: "/no-output.json",
        mapping: {
            input: {
                variables: {
                    data: "This won't be accessible via pointers",
                },
            },
            output: {
                variables: false, // No output
            },
        },
    },
    inputAsOutput: {
        type: "json",
        id: "passthrough",
        path: "/passthrough.json",
        mapping: {
            input: {
                variables: {
                    userName: "Alice",
                    userId: 123,
                    settings: {
                        theme: "dark",
                        language: "en",
                    },
                },
            },
            output: {
                variables: true, // Use input as output
            },
        },
    },
    customOutput: {
        type: "api-get",
        id: "transform",
        path: "/transform.json",
        mapping: {
            input: {
                variables: {
                    rawData: [1, 2, 3, 4, 5],
                },
            },
            output: {
                variables: {
                    sum: 15,
                    count: 5,
                    average: 3,
                    data: {
                        internal: "from-data",
                        path: "rawData",
                        schema: { type: "array", items: { type: "number" } },
                    },
                },
            },
        },
    },
};
// Edge cases and error scenarios
exports.edgeCases = {
    deeplyNested: {
        level1: {
            level2: {
                level3: {
                    level4: {
                        level5: {
                            value: {
                                internal: "pointer",
                                type: "json",
                                id: "deep-config",
                                path: "very/deeply/nested/path/to/value",
                            },
                        },
                    },
                },
            },
        },
    },
    arrayOfPointers: [
        {
            internal: "pointer",
            type: "api-get",
            id: "users-endpoint",
            path: "users/0",
        },
        {
            internal: "pointer",
            type: "api-get",
            id: "users-endpoint",
            path: "users/1",
        },
        {
            internal: "pointer",
            type: "api-get",
            id: "users-endpoint",
            path: "users/2",
        },
    ],
    mixedTypes: {
        static: "static value",
        pointer: {
            internal: "pointer",
            type: "json",
            id: "config-main",
            path: "apiVersion",
        },
        parameter: {
            internal: "parameter",
            id: "search-query",
            name: "q",
            schema: { type: "string" },
        },
        variable: {
            internal: "project-variable",
            key: "default_locale",
        },
        secret: {
            internal: "project-secret",
            key: "oauth_client_secret",
        },
        fromData: {
            internal: "from-data",
            path: "static",
            schema: { type: "string" },
        },
    },
    invalidReferences: {
        missingFile: {
            internal: "pointer",
            type: "json",
            id: "non-existent-file",
            path: "value",
        },
        invalidPath: {
            internal: "pointer",
            type: "json",
            id: "config-main",
            path: "this/path/does/not/exist",
        },
        wrongType: {
            internal: "pointer",
            type: "wrong-type",
            id: "config-main",
            path: "apiUrl",
        },
    },
};
