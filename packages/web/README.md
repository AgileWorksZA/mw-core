# OpenAPI UI Generator

A powerful platform for building UI components from multiple data sources with a focus on OpenAPI specifications. This application enables developers to quickly generate functional user interfaces, forms, and data grids directly from API definitions and other data sources.

## Project Overview

The OpenAPI UI Generator is designed to accelerate UI development by allowing you to:

- Connect to multiple data sources including OpenAPI specifications, GraphQL, REST endpoints, and more
- Transform and normalize data through a flexible transformation pipeline
- Generate fully functional UI components with minimal configuration
- Combine data from different sources into unified interfaces
- Export ready-to-use code for your applications

The core philosophy is "define once, generate everywhere" – connect your data sources, design your UI once, and deploy across multiple platforms and frameworks.

## Key Features

- 🔄 **Multi-Source Data Integration**: Connect to OpenAPI specs, GraphQL schemas, REST endpoints, and static data
- 🧩 **Flexible Component Generation**: Create data grids, forms, detail views, and more from your data sources
- 🔍 **Interactive Schema Explorer**: Visualize and navigate through your data schemas intuitively
- 🛠️ **Powerful Transformation System**: Map, filter, join, and transform data to fit your UI needs
- 💾 **Workspace Management**: Save, version, and share your UI designs
- 🔐 **Security Integration**: Handle authentication and authorization seamlessly
- 🧪 **Test & Preview**: Test your components with real or mock data before exporting
- 📦 **Code Export**: Generate clean, maintainable code for React, Vue, Angular, and other frameworks

## Core Modules

- **UI Designer**: Visual interface for creating UI components from data sources
- **Data Source Manager**: Connect, combine, and transform data from multiple sources
- **Schema Explorer**: Visualize and understand your API structure
- **Code Generator**: Export production-ready UI components
- **Testing Console**: Test your data flows and UI components

## Technology Stack

- ⚛️ React with TypeScript
- 🛣️ React Router for routing
- 🎭 TailwindCSS for styling
- 📊 TanStack Table & Form libraries
- 🔄 XState for state management
- 📦 Vite for bundling

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Basic knowledge of React and TypeScript

### Installation

Install with bun:

```bash
bun install
```

Or with Bun (recommended):

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

### Build for Production

Create a production build:

```bash
bun run build
```

## Documentation

For detailed documentation on the different modules:

- [UI Designer](/specs/ui-designer.md): Learn about the UI Designer module
- [Implementation Plan](/specs/implementation-plan.md): Overview of the implementation strategy
- [DX/UX Improvements](/specs/dx-ux-improvements.md): Developer and user experience guidelines

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for developers who value both speed and flexibility in UI development.

### BUGS 
- [x] Context-Designer: Syncing issues with the context designer

`AS A` user, I want to be able to add a new artifact, after I hit undo a couple of tims and I delete an artifact, I want to be able to add a new artifact after I deleted one,
`SO THAT` the state is reliably sent to the backend and the UI is updated accordingly.
