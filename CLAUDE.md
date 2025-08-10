# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Linting and formatting
npm run lint
npm run format
npm run format:check

# Preview production build
npm run preview
```

## Project Architecture

DeskStage is a 3D presentation tool that renders Markdown content in both traditional 2D views and immersive 3D environments. The application is built with React, TypeScript, and Three.js.

### Core Components Structure

**Main Application Flow:**
- `App.tsx` → `MarkdownEditor.tsx` → `MarkdownView.tsx` or `Markdown3DView.tsx`

**Key Architecture Points:**

1. **Markdown Processing Pipeline:**
   - Uses unified/remark/rehype ecosystem for Markdown parsing
   - Custom directives system (`:::js`, `:::textinput`, `:::button`, `:::resultdisplay`) 
   - Scene-based rendering: content is split by horizontal rules (`---`) into separate scenes
   - `MarkdownContext` provides shared state for interactive directives

2. **3D Presentation System:**
   - `Markdown3DView.tsx` creates a realistic presentation hall environment using Three.js
   - Uses `@react-three/fiber` and `@react-three/drei` for React Three.js integration
   - Embeds 2D Markdown content as HTML elements in 3D space using `Html` component
   - Features camera controls, lighting, and environmental effects

3. **Interactive Directives:**
   - Custom Markdown directives enable interactive content
   - JavaScript execution via QuickJS for sandboxed code execution
   - Shared state management through React Context for input/output coordination

### File Organization

- `src/features/markdown/` - Core markdown processing and rendering
  - `MarkdownEditor.tsx` - Main editor with 2D/3D toggle
  - `MarkdownView.tsx` - Traditional 2D renderer with scene navigation
  - `Markdown3DView.tsx` - 3D presentation hall renderer
  - `MarkdownContext.tsx` - Shared state for interactive components
  - `directives/` - Custom directive implementations

### Technology Stack

- **Frontend:** React 19 + TypeScript + Vite
- **3D Graphics:** Three.js + @react-three/fiber + @react-three/drei
- **Markdown:** unified + remark + rehype ecosystem
- **JavaScript Sandbox:** quickjs-emscripten
- **Styling:** Tailwind CSS v4 + @tailwindcss/typography
- **Linting:** ESLint + Prettier

### Key Dependencies

- `quickjs-emscripten` - Excluded from Vite optimization (see vite.config.ts)
- `@tailwindcss/typography` - Prose styling for rendered markdown
- Custom directive system built on `remark-directive`