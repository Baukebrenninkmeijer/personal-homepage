# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog for Bauke Brenninkmeijer, live at https://blog.baukebrenninkmeijer.nl.

**The live site is the Astro project in `astro/`.** The Quarto files at the repo root (`_quarto.yml`, `talks.qmd`, `about.qmd`, `resume.qmd`, `posts/`, `styles/`, `_brand.yml`) are the old site. They are not built or deployed, and editing them changes nothing on the live site.

## Commands

Run from `astro/` (Node >= 22.12):

```bash
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build to astro/dist/
npm run preview   # serve the built dist/
```

## Architecture

- **Pages** live in `astro/src/pages/` (`index`, `blog`, `projects`, `talks`, `resume`, `404`, `rss.xml.ts`). Blog post routes come from `blog/[...slug].astro`.
- **Talks** are hardcoded in `astro/src/pages/talks.astro`: one `TalkFeatured` block at the top, then a `timelineEntries` array rendered with `TalkEntry`. Add new talks to the top of `timelineEntries` (newest first) as `{ title, date, venue, links: [{ label, href }] }`. Link labels in use: `Slides`, `GitHub`, `Event`, `Live demo`.
- **Projects** are hardcoded in `astro/src/pages/projects.astro`.
- **Blog posts** are Markdown in `astro/src/content/posts/`, schema in `astro/src/content.config.ts` (`title`, `date`, `description`, optional `image`, `categories`, `draft`). Files ending in `.linkedin.md` are LinkedIn drafts and are excluded from the collection.
- **Static assets** go in `astro/public/` (self-hosted slide PDFs in `astro/public/slides/`, CV PDF, avatars, `CNAME`).
- **Styling**: Tailwind (`astro/tailwind.config.mjs`) plus `astro/src/styles/global.css`. Base classes are the dark styles; light-mode overrides use the custom `light:` variant (matches `:root.light`), toggled by `ThemeToggle.astro`.
- **Deployment**: push to `master` triggers `.github/workflows/deploy.yml`, which runs `astro build` in `astro/` and deploys `astro/dist` to GitHub Pages.
