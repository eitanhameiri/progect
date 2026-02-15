# CLAUDE.md

## Project Overview

**Repository**: `progect`
**Owner**: eitanhameiri
**Description**: Investment learning platform for beginner investors in Israel, combining AI with peer-to-peer community learning.

## Development Environment

- **Language/Framework**: React + TypeScript
- **Build system**: Vite
- **Package manager**: npm
- **CSS**: CSS Modules with RTL support
- **Routing**: React Router DOM
- **Font**: Heebo (Google Fonts)

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs tsc + vite build)
- `npm run preview` - Preview production build

## Repository Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (Button, Card, ProgressBar, Input, ScaleSlider)
│   └── layout/      # Layout components (Header, PageLayout)
├── pages/
│   ├── Landing/     # Home page
│   ├── Onboarding/  # Questionnaire flow
│   ├── ProfileResults/ # Profile results after questionnaire
│   ├── Community/   # Community feed with posts and comments
│   └── Profile/     # User profile page
├── config/
│   ├── questionnaire.ts  # All questionnaire questions configuration
│   └── profiles.ts       # Profile definitions (conservative, moderate, aggressive)
├── services/
│   ├── profiling.ts      # Profiling algorithm
│   └── mockData.ts       # Mock community data
├── context/
│   └── UserContext.tsx    # Global state management
├── types/
│   └── index.ts          # TypeScript type definitions
└── styles/
    ├── global.css         # Global styles + RTL
    └── variables.css      # CSS custom properties
```

## Conventions

- **Language**: Hebrew (RTL) - all UI text is in Hebrew
- **Type imports**: Use `import type` for type-only imports (verbatimModuleSyntax is enabled)
- **Components**: Each component has its own folder with `.tsx` + `.module.css`
- **State management**: React Context (UserContext)

## Git Workflow

- **Default branch**: `master`
- **Remote**: `origin`
