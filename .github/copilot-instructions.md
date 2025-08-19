# CubeStage AI Coding Instructions

CubeStage is a 3D presentation tool that renders Markdown content in both traditional 2D views and immersive 3D environments using React, TypeScript, and Three.js.

## Architecture Overview

### Core Flow
`App.tsx` → `MarkdownEditor.tsx` → (`MarkdownView.tsx` OR `Markdown3DView.tsx`)

- **Scene-based rendering**: Content splits by horizontal rules (`---`) into presentation scenes
- **Dual rendering modes**: Toggle between 2D prose view and 3D presentation hall
- **Interactive directives**: Custom Markdown extensions (`:::js`, `:::button`, `:::textinput`, `:::resultdisplay`) 
- **Shared state**: `MarkdownContext` coordinates directive interactions via React Context

### Key Components

- `MarkdownEditor.tsx`: Main editor with view mode toggles (edit/split/preview) and 2D/3D rendering selector
- `MarkdownView.tsx`: 2D renderer with scene navigation controls, uses unified/remark/rehype pipeline
- `Markdown3DView.tsx`: Creates realistic presentation hall using `@react-three/fiber` and `Html` components
- `MarkdownContext.tsx`: Provides shared state for input values, execution results, and event dispatching

### Interactive Directive System

Directives are processed via `directiveHandler.ts` during Markdown parsing:

```markdown
:::js id="calculator"
// JavaScript runs in QuickJS sandbox
result = input1 + input2;
:::

:::textinput id="input1" placeholder="Enter number"

:::button trigger="calculator"
Calculate
:::

:::resultdisplay id="calculator"
```

**Critical pattern**: Directives communicate through `MarkdownContext` using string IDs. JavaScript execution is sandboxed via `quickjs-emscripten` (excluded from Vite optimization).

## Development Workflows

### Commands
```bash
npm run dev          # Development server
npm run build        # TypeScript check + Vite build  
npm run lint         # ESLint check
npm run format       # Prettier format
```

### 3D Development
- Three.js components in `Markdown3DView.tsx` use `@react-three/drei` helpers
- HTML content embedded in 3D via `<Html>` component from `@react-three/drei`
- Environment uses `ContactShadows`, `Environment`, `OrbitControls` for realistic lighting/interaction

### Directive Development
1. Add handler in `directives/directiveHandler.ts`
2. Create component in `directives/` folder following `Button.tsx` pattern
3. Register in `MarkdownView.tsx` components object
4. Use `MarkdownContext` for cross-directive communication

## Project Conventions

### File Organization
- `src/features/markdown/` - Core markdown processing
- `src/features/markdown/directives/` - Interactive directive components
- Components follow React 19 patterns with TypeScript

### Styling
- Tailwind CSS v4 with `@tailwindcss/typography` for prose styling
- 3D scenes use Three.js material properties, not CSS

### Dependencies
- `quickjs-emscripten` requires Vite exclusion (see `vite.config.ts`)
- Unified ecosystem: `remark-parse`, `remark-directive`, `rehype-react`
- Three.js ecosystem: `@react-three/fiber`, `@react-three/drei`

### State Management
- No external state library - uses React Context for directive coordination
- Scene navigation state local to `MarkdownView`
- Editor state local to `MarkdownEditor`

## Common Patterns

### Adding New Directives
Follow the `Button.tsx` pattern: export handler function + React component, register in `MarkdownView.tsx`, use `useMarkdownContext()` for state.

### 3D Scene Modifications  
Modify `Markdown3DView.tsx` - all 3D objects use Three.js/react-three-fiber patterns with `<mesh>`, `<Box>`, `<Plane>` components.

### Markdown Processing
The pipeline: `unified()` → `remarkParse` → `remarkDirective` → `directiveHandler` → `remarkRehype` → `rehypeReact`
