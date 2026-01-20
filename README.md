# Diamond Quest Game

A 3D web-based implementation of the Smart Games Diamond Quest packing puzzle.

## Project Setup

This project uses:

- **React 18.2** - UI framework
- **TypeScript 5.3** - Type-safe development
- **Vite 5.0** - Fast build tool and dev server
- **Three.js 0.160** - 3D rendering engine
- **React Three Fiber 8.15** - React renderer for Three.js
- **React Three Drei 9.92** - Helper library for Three.js patterns

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
diamond-quest-game/
├── src/                  # Source files (to be created)
├── public/              # Static assets (to be created)
├── .kiro/               # Kiro specifications
│   └── specs/
│       └── diamond-quest-game/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## Features (Planned)

- 3D cross-shaped game board with 13 slots
- 13 colored diamond pieces (orange, yellow, green, blue, red)
- Drag-and-drop interaction
- 3D camera controls (rotate, zoom)
- Reset functionality
- PDF reference for puzzles and solutions
- Responsive design with touch support

## Browser Requirements

- WebGL 2.0 support
- Modern browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)

## License

Private project
