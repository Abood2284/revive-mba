# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js App Router tree; `layout.tsx` wires shared UI, `page.tsx` is the landing view, and `globals.css` loads Tailwind-aware styles.
- `public/` contains static assets (SVGs, headers config) served verbatim; use kebab-case filenames.
- Root configs (`next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`) control Cloudflare deployment; `cloudflare-env.d.ts` documents typed bindings.
- TypeScript uses the `@/*` alias (see `tsconfig.json`) so prefer `import { … } from "@/app/..."` over relative paths.

## Build, Test, and Development Commands
- `npm run dev` starts TurboPack-driven local development at `http://localhost:3000`.
- `npm run lint` runs `next lint` with the shared ESLint config; fix or suppress issues before pushing.
- `npm run build` compiles a production bundle; use it before deployment reviews.
- `npm run start` serves the production build locally for smoke tests.
- `npm run preview` builds with `@opennextjs/cloudflare` and deploys to a temporary preview; `npm run deploy` promotes the same build.
- `npm run cf-typegen` refreshes Wrangler type definitions whenever Cloudflare bindings change.

## Coding Style & Naming Conventions
- Use TypeScript with `strict` rules (see `tsconfig.json`); avoid `any` unless cast comments justify it.
- Components and hooks live in PascalCase files; helper utilities use camelCase; keep App Router files lowercase (`page.tsx`, `layout.tsx`).
- Prefer functional React components, Tailwind utility classes, and 2-space indentation. Run `npm run lint` after formatting.

## Testing Guidelines
- No automated tests are configured yet; when adding them, co-locate UI tests under the relevant route (`app/**/__tests__`) and integration suites under `tests/`.
- Use React Testing Library with Vitest or Jest for component coverage; document added tooling in the PR.
- Provide manual test notes in PRs until automated coverage exists.

## Commit & Pull Request Guidelines
- Follow the short, imperative style used in history (e.g., `Add hero CTA layout`). Limit subjects to ~60 characters and describe scope in the body if needed.
- Every PR should include: a concise summary, screenshots or logs for UI-affecting changes, a checklist of commands run, and links to related issues or tickets.
- Keep feature branches rebased on `main` before requesting review; squash locally to maintain a linear history.

## Cloudflare Deployment Notes
- Environment secrets must be declared via `wrangler secret put` and typed in `cloudflare-env.d.ts`.
- Verify previews with `npm run preview` before promoting; confirm regional caches are clear when altering static assets.
