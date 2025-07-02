# MoneyWorks Web1 - Enterprise Traditional Interface

A professional, enterprise-focused web application for MoneyWorks accounting system management.

## Features

- **Enterprise Traditional Design**: Clean, professional interface optimized for power users
- **React Router 7**: Modern routing with server-side rendering support
- **TailwindCSS + ShadCN UI**: Beautiful, accessible components
- **Multi-language Support**: English, Afrikaans, and French
- **Dark Mode**: Built-in theme switching for long working sessions
- **Keyboard Navigation**: Comprehensive keyboard shortcuts for efficiency
- **Real-time Data**: Live sync indicators with caching support

## Tech Stack

- React Router 7
- Bun (no build step required)
- TailwindCSS
- ShadCN UI Components
- TanStack Query & Table
- Clerk Authentication
- i18next for internationalization

## Getting Started

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

The application will be available at http://localhost:3000

## Key Features

### Tax Rates Management
- Full CRUD operations
- Advanced filtering and sorting
- Bulk operations support
- Export to PDF, Excel, CSV

### Company Information
- Comprehensive company details view
- System information display
- Configuration overview

### MWScript Evaluator
- Real-time expression evaluation
- Syntax highlighting
- History tracking
- Example expressions

### Settings
- Language selection (EN, AF, FR)
- Theme switching (Light/Dark/System)
- Keyboard shortcut reference
- Import/Export settings

## Architecture

```
packages/web1/
├── app/
│   ├── routes/          # React Router 7 routes
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities and API client
│   └── styles/         # Global styles and Tailwind config
├── public/             # Static assets
└── build/             # Production build output
```

## Design Philosophy

**Enterprise Traditional** focuses on:
- Data density for efficient information display
- Professional color schemes
- Clear visual hierarchy
- Comprehensive keyboard navigation
- Multi-panel layouts with collapsible sections
- Export-focused features for reporting

## Development

### Adding New Routes

Create a new file in `app/routes/` following React Router 7 conventions:

```tsx
export async function loader({ request }: LoaderFunctionArgs) {
  // Load data
}

export async function action({ request }: ActionFunctionArgs) {
  // Handle form submissions
}

export default function MyRoute() {
  // Component code
}
```

### API Integration

The API client is located at `app/lib/api.ts`. Add new endpoints as needed:

```typescript
async getNewEndpoint(params: Params): Promise<Response> {
  return this.request(`/new-endpoint`, { params });
}
```

### Internationalization

Add translations to `app/lib/i18n.ts`:

```typescript
en: {
  translation: {
    myKey: "My translated text"
  }
}
```

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New tax rate
- `Ctrl/Cmd + S`: Save changes
- `Esc`: Cancel/Close dialog
- `Tab`: Navigate fields
- `Enter`: Submit form

## Building for Production

```bash
bun run build
bun run start
```