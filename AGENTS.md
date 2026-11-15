<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Design Guidelines

The site has one visual system: neutral surfaces, hairline borders, one muted accent per subject, no glows, gradients or glass effects.

- **Use the design tokens** in `app/globals.css`, never hex colors or `isLight ? … : …` ternaries: `bg-canvas`, `bg-card`, `bg-subtle`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-line`, `border-line-strong`, `text-accent`, `bg-accent-soft`, `text-success` / `warning` / `danger`. They switch with the theme on their own. When a color must differ per theme, use `dark:` (it follows the toggle, not the OS).
- **Use the shared components** in `components/site/`: `PageShell` + `PageHeader` for regular pages and hubs, `ActivityBar` for full-screen tools, games and presentations, `LinkCard`, `Badge`, `Segmented`, `EmptyState`, and the `btn` styles in `components/site/ui.tsx`.
- **Comfort Reading Mode (required on every page):** every page must show the light/dark toggle. `PageShell` and `ActivityBar` include it; otherwise render `ThemeToggle` from `components/site/ThemeToggle.tsx`. Light is the default. Read the mode only through `useComfortMode()` (`lib/hooks/useComfortMode.ts`); do not touch `localStorage` for the theme directly.
- **Subject accent:** pages get their accent color from their entry in `lib/content-registry.ts` automatically.
- **Site name:** use `SITE_NAME` from `lib/site.ts`, never a hard-coded name.
- **Photos:** real, freely licensed photos only, saved under `public/images/` and listed in `lib/data/photo-credits.ts` (shown on `/credits`). No AI-generated art, no hotlinked images.
- **Icons:** Lucide at `strokeWidth={1.75}`. No emojis as decoration in markup.
