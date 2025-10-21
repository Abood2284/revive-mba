# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Revive MBA** is a Next.js application with Cloudflare deployment configuration using OpenNext.js for Cloudflare. The project uses the Next.js App Router architecture with TypeScript and Tailwind CSS v4.

## Architecture

- **Framework**: Next.js 15.4.6 with App Router (React 19.1.0)
- **Styling**: Tailwind CSS v4 with custom CSS variables and dark mode support
- **Typography**: Geist font family (sans and mono variants)
- **Deployment**: Cloudflare Workers/Pages using @opennextjs/cloudflare
- **TypeScript**: Full TypeScript configuration with path aliases (`@/*`)

### Project Structure
```
/app                 - Next.js App Router pages and layouts
  /layout.tsx        - Root layout with font and metadata configuration
  /page.tsx          - Homepage component
  /globals.css       - Global styles with Tailwind import and theme variables
/public              - Static assets
open-next.config.ts  - OpenNext.js Cloudflare configuration
next.config.ts       - Next.js configuration with Cloudflare initialization
cloudflare-env.d.ts  - Auto-generated Cloudflare environment types
```

## Development Commands

### Core Development
- **`npm run dev`** - Start development server with Turbopack
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server locally
- **`npm run lint`** - Run ESLint

### Cloudflare Deployment
- **`npm run deploy`** - Build and deploy to Cloudflare
- **`npm run preview`** - Build and preview on Cloudflare
- **`npm run cf-typegen`** - Generate Cloudflare environment types

## Key Configuration

### Cloudflare Integration
- Uses `@opennextjs/cloudflare` for deployment
- Environment types generated via `wrangler types`
- Cloudflare context available via `getCloudflareContext()` in dev mode

### Styling System
- Tailwind CSS v4 with custom theme configuration
- CSS variables for theming (`--background`, `--foreground`)
- Dark mode support via `prefers-color-scheme`
- Font variables: `--font-geist-sans`, `--font-geist-mono`

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Includes Cloudflare environment types
- Next.js plugin for enhanced TypeScript support

## Development Notes

- Development server uses Turbopack for faster builds
- The project is set up for Cloudflare deployment out of the box
- All styling uses Tailwind CSS v4 syntax
- Dark mode is handled automatically via CSS media queries
- Font loading is optimized using Next.js font optimization