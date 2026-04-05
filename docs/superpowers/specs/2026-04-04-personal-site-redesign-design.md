# Personal Homepage Redesign — Design Spec

## Overview

Redesign baukebrenninkmeijer.github.io from a Quarto blog into a modern portfolio site built with Astro 5 + Tailwind CSS. The site prioritizes professional credibility, then project showcase, then blog content. The primary audience is people who've just met Bauke (at a talk, meetup, or online) and want to learn more, with secondary audiences of recruiters and technical peers.

## Stack

- **Astro 5** — static site generator with content collections for blog posts
- **Tailwind CSS** — utility-first styling, dark/light theme support
- **No JS framework** — pure `.astro` components. React/Vue/Svelte islands only if a specific interactive feature demands it later.
- **Deploy**: GitHub Actions → `astro build` → push to `gh-pages` branch
- **Hosting**: GitHub Pages (same domain as current site)

## Design Language

- **Clean and minimal** — generous whitespace, strong typography, understated
- **Dark default** with light mode toggle (respects OS preference)
- **Monochrome palette** — pure black (#0a0a0a), white (#fafafa), greys. No accent color.
- **Typography**: Inter for body/headings, JetBrains Mono for code. Both via Google Fonts.
- **Animations**: CSS fade-in on page load, subtle hover effects on cards/links. Astro View Transitions for smooth page-to-page crossfades.

## Pages & Layouts

### Base Layout

All pages share:
- **Nav bar** (top): text links left (Projects, Blog, Talks, Resume), small social icons right (GitHub, LinkedIn), dark/light toggle
- **Footer** (bottom): copyright + social icons, single line
- Dark background (#0a0a0a), light text (#fafafa in dark mode, inverted in light mode)

### 1. Homepage (`/`)

Hero section with a small credibility anchor below.

**Hero (top, vertically centered with generous padding):**
- **Name**: "Bauke Brenninkmeijer" — large, bold
- **Subtitle**: One-liner about what he does (AI Research Engineer at orq.ai, AI agent infrastructure, LLM evaluation, production AI)
- **Photos**: Two circular images, slightly overlapping — real photo in front, Pokemon avatar behind. On hover, they subtly shift apart.
- **CTA buttons**: "View Projects" and "Read Blog" — subtle bordered buttons
- Fade-in animation on load

**What I do (below hero, compact):**
- 5 topic pills/labels: *AI Agents / LLM Evaluation / LLMOps / Fine-tuning & Prompt Engineering / Synthetic Data*
- One-liner: "Available for speaking and collaboration"
- Contact: bauke.brenninkmeijer@orq.ai + [Schedule a call](https://calendar.app.google/7ET48JSCNjYVgiLH7)

**Featured section (below "What I do", subtle):**
- A small "Latest" or "Featured" row showing 1 highlighted talk or project — keeps the page minimal while giving social proof to first-time visitors. Example: "Speaking at iO Engineering Manager Meetup — April 15" or the latest blog post. Just a single line/card, not a full grid.

### 2. Projects (`/projects`)

Card grid (2-3 columns on desktop, single column on mobile).

**Projects to feature:**

1. **table-evaluator**
   - Description: Open-source Python library for evaluating synthetic data quality. 92+ stars.
   - Tags: Python, PyPI, Open Source
   - Links: GitHub, PyPI
   
2. **Master Thesis — Synthetic Tabular Data with GANs**
   - Description: Research on improving GANs for tabular data generation and evaluation
   - Tags: Python, GANs, Research
   - Links: GitHub, Thesis PDF

3. **OpenClaw**
   - Description: orq.ai open-source project
   - Tags: Open Source
   - Links: GitHub

4. **Context is King**
   - Description: PyData Amsterdam 2025 project + talk on long context vs RAG
   - Tags: Python, LLMs, RAG
   - Links: GitHub

Each card: title, short description, tech tags as small pills, links as icons. Subtle border (#1a1a1a), slight lift on hover.

### 3. Blog (`/blog`)

Card grid with thumbnails.

- Each card: thumbnail image (or placeholder), title, date, short description, category tags
- Sort by date descending
- No filtering (only 6 posts currently)
- Cards link to individual post pages

**Individual post pages** (`/blog/[slug]`): clean reading layout, max-width prose container, good code block styling with JetBrains Mono.

**Content collection schema** (`src/content/config.ts`):
```ts
posts: {
  title: string        // required
  date: Date           // required
  description: string  // required, used on cards
  image?: string       // optional thumbnail path
  categories?: string[] // optional tags
  draft?: boolean      // optional, hides from listing
}
```

**Content migration:**
- `.md` posts → direct transfer, update frontmatter to Astro schema
- `.qmd` posts → convert to `.md`, strip Quarto-specific syntax (e.g. `execute:` blocks, `{{< >}}` shortcodes)
- `.ipynb` posts → extract from Quarto's `_freeze/` directory. The frozen output contains pre-rendered cell outputs as HTML/images. Combine the notebook's markdown cells with the frozen output images into clean `.md` files. Copy output images to `src/assets/posts/`. No re-execution needed.

### 4. Talks (`/talks`)

Vertical timeline layout.

**Featured talk (expanded card):**
- **PyData Amsterdam 2025 — Context is King**: large card with description, repo link, slides

**Timeline entries (compact):**
- **iO Engineering Manager Meetup** — April 15, 2026 — "How to start using AI with a software engineering team" *(upcoming, tag it)*
- **Teams of Agents** — April 3, 2026 — Parallel AI agent teams demo. Links: [GitHub](https://github.com/Baukebrenninkmeijer/claude-agents-team-demo), Excalidraw slides
- **Lessen uit de loopgraven** — August 22, 2025 — Turner Thinking Thursday, business-side AI lessons. PDF slides.
- **A Developer's Guide to GenAI** — ~May 2025 — Sytac DevJam. Links: [GitHub](https://github.com/Baukebrenninkmeijer/developers-guide-to-genai)
- **SQLAlchemy Introduction** — May 2023. Links: [GitHub](https://github.com/Baukebrenninkmeijer/sqlalchemy-introduction), Slides
- **Diving into NLP Tokenizers** — DSFC, April 2022. Links: [GitHub](https://github.com/Baukebrenninkmeijer/diving-into-nlp-tokenizers-dsfc-2022), Slides
- **Practical Data Science** — April 2022. Links: [GitHub](https://github.com/Baukebrenninkmeijer/practical-data-science), Slides
- **Code First Intro to ML** — July 2020. Links: [GitHub](https://github.com/Baukebrenninkmeijer/Code-First-Introduction-to-Machine-Learning), Slides
- **FakeFynder** — Hackathon for Good, August 2019. Links: [GitHub](https://github.com/Baukebrenninkmeijer/FakeFynder-Hackathon-for-Good-2019)
- **Master Thesis Defense** — September 2019. Links: [GitHub](https://github.com/Baukebrenninkmeijer/On-the-Generation-and-Evaluation-of-Synthetic-Tabular-Data-using-GANs), Slides PDF

Featured talk gets a larger card in the timeline flow. Compact entries are single rows: date, title, venue, and small link icons.

### 5. Resume (`/resume`)

PDF download button at the top.

**Experience timeline:**
- **orq.ai** — AI Research Engineer, Aug 2025–present. AI agent infrastructure, LLM evaluation, prompt optimization, observability tooling.
- **MLOps Community Amsterdam** — Organiser, Sep 2024–present.
- **Sytac → ING** — Senior Consultant / Senior AI Engineer, May 2024–Jul 2025. Consulted at ING via Sytac. Detection/forecasting system for reliability events (1TB data, Polars). RAG-based sustainability peer review app. Fraud detection MLOps. Also: LLM-based info extraction for Sytac's internal resume app, improved internal Slackbot search. Spoke at Sytac DevJam.
- **ABN AMRO** — Full Stack Data Scientist (Global Markets), Jul 2021–May 2024. Data platform migration (IaaS to PaaS), real-time streaming with Spark, bond origination prediction.
- **ABN AMRO** — Data Scientist (Chief Architecture & Data Management), Oct 2019–Jun 2021. Mortgage assessments, data metadata generation, synthetic data for privacy.
- **ABN AMRO** — Thesis Intern, Mar 2019–Oct 2019. GANs for synthetic tabular data.
- **OneTwoModel** — CTO & Co-founder, Sep 2019–Nov 2021. Startup building products for the modelling industry.
- **TAPP** — Data Scientist, Sep 2018–Mar 2019. NLP-based product classification from receipt descriptions.

**Education:**
- **Radboud University** — MSc Data Science, 2017–2019
- **Radboud Universiteit Nijmegen** — BSc Computing Science, 2013–2017

Styled as a clean vertical timeline with role/company/dates and brief bullet points. Monochrome, consistent with the rest of the site.

## File Structure

```
/
├── src/
│   ├── layouts/
│   │   └── Layout.astro              # Base layout: nav, footer, dark/light, view transitions
│   ├── components/
│   │   ├── Nav.astro                  # Text nav links + social icons + theme toggle
│   │   ├── Footer.astro              # Copyright + social icons
│   │   ├── Hero.astro                # Name, subtitle, overlapping photos, CTAs
│   │   ├── ProjectCard.astro         # Card for projects grid
│   │   ├── BlogCard.astro            # Card for blog grid
│   │   ├── TalkFeatured.astro        # Expanded talk card
│   │   ├── TalkEntry.astro           # Compact timeline entry
│   │   ├── TimelineEntry.astro       # Resume timeline entry
│   │   └── ThemeToggle.astro         # Dark/light toggle button
│   ├── content/
│   │   └── posts/                    # Migrated blog posts as .md files
│   ├── pages/
│   │   ├── index.astro               # Homepage (hero only)
│   │   ├── projects.astro            # Projects card grid
│   │   ├── blog.astro                # Blog card grid
│   │   ├── blog/[...slug].astro      # Individual blog post
│   │   ├── talks.astro               # Talks timeline
│   │   └── resume.astro              # HTML resume with PDF download
│   ├── styles/
│   │   └── global.css                # Tailwind imports + any custom CSS
│   └── assets/
│       ├── profile.jpg               # Real photo
│       ├── pokemon-avatar.jpg        # Pokemon LinkedIn photo
│       └── posts/                    # Blog post images
├── public/
│   ├── favicon.png
│   └── CV_Bauke_Brenninkmeijer.pdf   # Downloadable resume
├── src/pages/404.astro                # Custom 404 page (monochrome, links back home)
├── astro.config.mjs                   # Must set site: and base: for GitHub Pages subpath
├── tailwind.config.mjs
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml                # GitHub Actions: build + deploy to gh-pages
```

## Animations & Interactions

- **Page load**: Content fades in (CSS `@keyframes fadeIn`, applied to main content)
- **Page transitions**: Astro View Transitions API for smooth crossfades between pages
- **Hero photos**: On hover, the overlapping photos shift apart slightly (CSS `transform: translateX`)
- **Cards** (projects, blog): Subtle lift on hover (`transform: translateY(-2px)`, border lightens)
- **Nav links**: Underline slides in from left on hover
- **Timeline**: Entries fade in as they scroll into view (CSS `animation` with `IntersectionObserver` or pure CSS `@starting-style` if supported)

## Dark/Light Theme

- Default: dark (#0a0a0a background, #fafafa text, #888 secondary text, #1a1a1a borders)
- Light: inverted (#fafafa background, #0a0a0a text, #666 secondary text, #e0e0e0 borders)
- Toggle in nav bar (moon/sun icon)
- Respects `prefers-color-scheme` on first visit
- Persists preference in `localStorage`

## SEO & Meta

- `<title>` and `<meta description>` per page
- Open Graph tags for social sharing
- Twitter card (summary_large_image)
- Sitemap (auto-generated by `@astrojs/sitemap`)
- RSS feed for blog posts
- `robots.txt`
- Canonical URLs
- Favicon

## Deployment

GitHub Actions workflow:
1. Trigger on push to `master`
2. Install Node.js, install dependencies
3. `astro build`
4. Deploy `dist/` to `gh-pages` branch

**Important:** Since the repo is named `personal-homepage` (not `<username>.github.io`), the site is served at `/personal-homepage/`. Set `site: 'https://baukebrenninkmeijer.github.io'` and `base: '/personal-homepage'` in `astro.config.mjs`. All internal links and asset paths must respect this base path.

## Content Migration Checklist

- [ ] Convert 2 `.md` posts to Astro content collection format
- [ ] Convert 1 `.qmd` post (genetic algorithms) to standard markdown
- [ ] Convert 1 `.qmd` post (long context vs RAG) to standard markdown
- [ ] Pre-render 3 `.ipynb` posts (Spotify series) to markdown with outputs
- [ ] Copy all post images to `src/assets/posts/`
- [ ] Copy profile photos to `src/assets/`
- [ ] Copy resume PDF to `public/`
- [ ] Copy favicon to `public/`

## Out of Scope

- Contact form (no backend)
- Comments/discussions on blog posts
- Blog search/filtering (not enough content yet)
- Analytics (can add Google Analytics or Plausible later)
- Custom domain setup (keep GitHub Pages default for now)
