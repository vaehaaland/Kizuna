# Kizuna

Fast, efficient and feature rich ToDo application built for ease of use and time tracking

## Features

- **Multi-page Nuxt 3 Application** - Built with Vue 3, TypeScript, and modern web technologies
- **Task Management** - Full CRUD operations for tasks with title, description, priority, due dates, projects, and tags
- **Smart Organization**
  - **Inbox** - All incomplete tasks in one place
  - **Today** - Tasks due today
  - **Projects** - Tasks organized by project
- **Powerful Search & Filtering** - Quick search and filter by completion status, priority, and project
- **Dark Mode** - Toggle between light and dark themes with system preference detection
- **Keyboard Shortcuts**
  - `Ctrl+N` - Create new task
  - `Ctrl+F` - Focus search
- **Import/Export** - Backup and restore your tasks as JSON
- **Offline-First** - All data stored locally in IndexedDB using Dexie
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Accessibility** - Built with a11y best practices

## Tech Stack

- **Frontend Framework**: Nuxt 3 (Vue 3)
- **Language**: TypeScript
- **Styling**: TailwindCSS with theme variables
- **State Management**: Pinia
- **Database**: IndexedDB via Dexie
- **Testing**: Vitest with Vue Test Utils
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vaehaaland/Kizuna.git
cd Kizuna
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

## Project Structure

```
Kizuna/
├── assets/           # CSS and static assets
├── components/       # Vue components
│   ├── EmptyState.vue
│   ├── Modal.vue
│   ├── TaskForm.vue
│   └── TaskItem.vue
├── composables/      # Vue composables
│   ├── useKeyboardShortcuts.ts
│   └── useTheme.ts
├── layouts/          # Nuxt layouts
│   └── default.vue
├── pages/            # Nuxt pages (auto-routed)
│   ├── index.vue     # Inbox
│   ├── today.vue     # Today's tasks
│   ├── projects.vue  # Project view
│   └── settings.vue  # Settings & import/export
├── stores/           # Pinia stores
│   └── tasks.ts
├── tests/            # Test files
│   ├── setup.ts
│   └── storage.test.ts
├── types/            # TypeScript types
│   └── task.ts
├── utils/            # Utility functions
│   └── storage.ts    # IndexedDB adapter
└── .github/
    └── workflows/
        └── ci.yml    # CI/CD configuration
```

## Database Schema

Tasks are stored with the following structure:

```typescript
interface Task {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date | null;
  priority: 'low' | 'medium' | 'high';
  project?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the [LICENSE](LICENSE) file for details.

## Version

2026.01.1 - Initial release

