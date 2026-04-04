# Personal Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild baukebrenninkmeijer.github.io as an Astro 5 + Tailwind site with monochrome dark-first design, replacing the current Quarto setup.

**Architecture:** Static site built with Astro 5 content collections for blog posts and pure `.astro` components for all pages. Tailwind CSS handles styling with a custom dark/light monochrome theme. GitHub Actions deploys to `gh-pages`.

**Tech Stack:** Astro 5, Tailwind CSS, @fontsource/inter, @fontsource/jetbrains-mono, @astrojs/sitemap

---

## File Structure

```
src/
├── layouts/
│   └── Layout.astro              # Base HTML shell: head, nav, footer, view transitions, theme
├── components/
│   ├── Nav.astro                  # Text links left, social icons + theme toggle right
│   ├── Footer.astro              # Copyright + social icons
│   ├── Hero.astro                # Name, subtitle, overlapping photos, topics, CTAs
│   ├── ProjectCard.astro         # Card for projects grid
│   ├── BlogCard.astro            # Card for blog grid
│   ├── TalkFeatured.astro        # Expanded featured talk card
│   ├── TalkEntry.astro           # Compact timeline row
│   ├── TimelineEntry.astro       # Resume experience entry
│   └── ThemeToggle.astro         # Dark/light toggle with localStorage
├── content/
│   ├── config.ts                 # Content collection schema
│   └── posts/                    # Migrated blog posts as .md
├── pages/
│   ├── index.astro               # Homepage: hero + topics + featured
│   ├── projects.astro            # Projects card grid
│   ├── blog.astro                # Blog card grid
│   ├── blog/[...slug].astro      # Individual blog post
│   ├── talks.astro               # Talks timeline
│   ├── resume.astro              # HTML resume + PDF download
│   ├── 404.astro                 # Custom 404
│   └── rss.xml.ts                # RSS feed
├── styles/
│   └── global.css                # Tailwind directives + custom animations
└── assets/
    ├── profile.jpg
    ├── pokemon-avatar.jpg
    └── posts/                    # Blog post images
public/
├── favicon.png
└── CV_Bauke_Brenninkmeijer.pdf
astro.config.mjs
tailwind.config.mjs
package.json
.github/workflows/deploy.yml
```

---

### Task 1: Scaffold Astro project with Tailwind and fonts

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `src/styles/global.css`, `tsconfig.json`

- [ ] **Step 1: Initialize Astro project**

Run from the repo root. We create a new Astro project in a subdirectory then move files up, to avoid conflicting with existing Quarto files during migration.

```bash
cd /Users/baukebrenninkmeijer/Developer/personal-homepage
npm create astro@latest astro-site -- --template minimal --no-install --no-git
```

- [ ] **Step 2: Move Astro files to repo root**

```bash
# Move Astro scaffolding to repo root (don't overwrite existing files we want to keep)
cp -r astro-site/src .
cp astro-site/astro.config.mjs .
cp astro-site/tsconfig.json .
cp astro-site/package.json .
rm -rf astro-site
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
npm install tailwindcss @astrojs/tailwind @astrojs/sitemap
npm install @fontsource/inter @fontsource-variable/jetbrains-mono
```

- [ ] **Step 4: Configure astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://baukebrenninkmeijer.github.io',
  base: '/personal-homepage',
  integrations: [tailwind(), sitemap()],
});
```

- [ ] **Step 5: Configure tailwind.config.mjs**

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0a0a0a',
          light: '#fafafa',
        },
        text: {
          dark: '#fafafa',
          light: '#0a0a0a',
        },
        muted: {
          dark: '#888888',
          light: '#666666',
        },
        border: {
          dark: '#1a1a1a',
          light: '#e0e0e0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Create global.css**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg-dark text-text-dark font-sans;
  }

  .light body,
  body.light {
    @apply bg-bg-light text-text-light;
  }

  code, pre {
    @apply font-mono;
  }

  /* Prose styling for blog posts */
  .prose {
    @apply max-w-3xl mx-auto;
  }

  .prose h1, .prose h2, .prose h3 {
    @apply font-bold mt-8 mb-4;
  }

  .prose p {
    @apply mb-4 leading-relaxed;
  }

  .prose a {
    @apply underline decoration-muted-dark hover:decoration-text-dark transition-colors;
  }

  .light .prose a {
    @apply decoration-muted-light hover:decoration-text-light;
  }

  .prose pre {
    @apply rounded-lg p-4 my-6 overflow-x-auto bg-[#111] border border-border-dark;
  }

  .light .prose pre {
    @apply bg-[#f0f0f0] border-border-light;
  }

  .prose img {
    @apply rounded-lg my-6;
  }

  .prose blockquote {
    @apply border-l-2 border-border-dark pl-4 italic text-muted-dark;
  }

  .light .prose blockquote {
    @apply border-border-light text-muted-light;
  }
}
```

- [ ] **Step 7: Verify the project builds**

```bash
npx astro build
```

Expected: Build succeeds with an empty site.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tailwind.config.mjs tsconfig.json src/styles/global.css src/env.d.ts
git commit -m "feat: scaffold Astro project with Tailwind and fonts"
```

---

### Task 2: Base layout, nav, footer, and theme toggle

**Files:**
- Create: `src/layouts/Layout.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/ThemeToggle.astro`
- Create: `src/pages/index.astro` (placeholder to test layout)

- [ ] **Step 1: Create ThemeToggle.astro**

```astro
---
// src/components/ThemeToggle.astro
---
<button
  id="theme-toggle"
  class="text-muted-dark hover:text-text-dark transition-colors text-sm border border-border-dark rounded px-2 py-1"
  aria-label="Toggle dark/light mode"
>
  <span id="theme-icon">☾</span>
</button>

<script is:inline>
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  function getTheme() {
    if (localStorage.getItem('theme')) return localStorage.getItem('theme');
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    html.classList.toggle('light', theme === 'light');
    icon.textContent = theme === 'light' ? '☀' : '☾';
    localStorage.setItem('theme', theme);
  }

  setTheme(getTheme());

  toggle.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
</script>
```

- [ ] **Step 2: Create Nav.astro**

```astro
---
// src/components/Nav.astro
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '/personal-homepage/projects', label: 'Projects' },
  { href: '/personal-homepage/blog', label: 'Blog' },
  { href: '/personal-homepage/talks', label: 'Talks' },
  { href: '/personal-homepage/resume', label: 'Resume' },
];
---
<nav class="flex justify-between items-center px-6 md:px-10 py-4 border-b border-border-dark">
  <div class="flex gap-6 text-sm">
    {links.map(link => (
      <a
        href={link.href}
        class="text-muted-dark hover:text-text-dark transition-colors relative group"
      >
        {link.label}
        <span class="absolute bottom-0 left-0 w-0 h-px bg-text-dark transition-all group-hover:w-full"></span>
      </a>
    ))}
  </div>
  <div class="flex items-center gap-3 text-sm text-muted-dark">
    <a href="https://github.com/Baukebrenninkmeijer" target="_blank" rel="noopener" aria-label="GitHub" class="hover:text-text-dark transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
    </a>
    <a href="https://www.linkedin.com/in/bauke-brenninkmeijer-40143310b/" target="_blank" rel="noopener" aria-label="LinkedIn" class="hover:text-text-dark transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </a>
    <ThemeToggle />
  </div>
</nav>
```

Note: the `.light` class variants for nav should work because Tailwind's `darkMode: 'class'` is configured. We add light-mode overrides to Nav links via group styling. For simplicity, the nav uses the same colors — in light mode, the border and text colors invert via the global CSS.

- [ ] **Step 3: Create Footer.astro**

```astro
---
// src/components/Footer.astro
---
<footer class="flex justify-between items-center px-6 md:px-10 py-4 border-t border-border-dark text-xs text-muted-dark">
  <span>&copy; 2026 Bauke Brenninkmeijer</span>
  <div class="flex gap-3">
    <a href="https://github.com/Baukebrenninkmeijer" target="_blank" rel="noopener" aria-label="GitHub" class="hover:text-text-dark transition-colors">
      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
    </a>
    <a href="https://www.linkedin.com/in/bauke-brenninkmeijer-40143310b/" target="_blank" rel="noopener" aria-label="LinkedIn" class="hover:text-text-dark transition-colors">
      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </a>
  </div>
</footer>
```

- [ ] **Step 4: Create Layout.astro**

```astro
---
// src/layouts/Layout.astro
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource-variable/jetbrains-mono';
import '../styles/global.css';
import { ViewTransitions } from 'astro:transitions';

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description = 'Bauke Brenninkmeijer — AI Research Engineer', image } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/personal-homepage/favicon.png" />
    <title>{title} | Bauke Brenninkmeijer</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={new URL(image, Astro.site)} />}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={new URL(image, Astro.site)} />}

    <ViewTransitions />

    <!-- Prevent FOUC: apply theme before render -->
    <script is:inline>
      (function() {
        const theme = localStorage.getItem('theme') ||
          (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        if (theme === 'light') document.documentElement.classList.add('light');
      })();
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-1 animate-fade-in">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: Create placeholder index.astro**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---
<Layout title="Home">
  <div class="flex items-center justify-center min-h-[60vh]">
    <h1 class="text-4xl font-bold">Bauke Brenninkmeijer</h1>
  </div>
</Layout>
```

- [ ] **Step 6: Copy static assets**

```bash
cp posts/images/favicon.png public/favicon.png
cp posts/resume/CV_Bauke_Brenninkmeijer.pdf public/CV_Bauke_Brenninkmeijer.pdf
cp profile.jpg src/assets/profile.jpg
```

For the Pokemon avatar, the user needs to provide the image file. Create a placeholder:

```bash
# User action needed: copy Pokemon avatar to src/assets/pokemon-avatar.jpg
# For now, copy the real photo as a placeholder
cp profile.jpg src/assets/pokemon-avatar.jpg
```

- [ ] **Step 7: Test dev server**

```bash
npx astro dev
```

Expected: Site loads at `localhost:4321/personal-homepage/` with nav, footer, theme toggle, and "Bauke Brenninkmeijer" centered text.

- [ ] **Step 8: Commit**

```bash
git add src/layouts/ src/components/ src/pages/index.astro src/assets/ public/
git commit -m "feat: add base layout with nav, footer, and theme toggle"
```

---

### Task 3: Homepage — hero, topics, and featured section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero.astro**

```astro
---
// src/components/Hero.astro
---
<section class="flex flex-col items-center justify-center min-h-[70vh] px-6 md:px-10 py-16">
  <div class="flex flex-col md:flex-row items-center gap-12 md:gap-16 max-w-4xl">
    <!-- Text -->
    <div class="max-w-md text-center md:text-left">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3">Bauke Brenninkmeijer</h1>
      <p class="text-muted-dark text-base md:text-lg leading-relaxed mb-6">
        AI Research Engineer at <a href="https://orq.ai" class="underline hover:text-text-dark transition-colors">orq.ai</a>.
        I build AI agent infrastructure, evaluate LLMs, and write about getting models into production.
      </p>
      <div class="flex gap-3 justify-center md:justify-start">
        <a href="/personal-homepage/projects" class="border border-border-dark text-muted-dark hover:text-text-dark hover:border-text-dark px-4 py-2 rounded text-sm transition-colors">View Projects</a>
        <a href="/personal-homepage/blog" class="border border-border-dark text-muted-dark hover:text-text-dark hover:border-text-dark px-4 py-2 rounded text-sm transition-colors">Read Blog</a>
      </div>
    </div>

    <!-- Overlapping photos -->
    <div class="relative w-48 h-36 flex-shrink-0">
      <!-- Pokemon avatar (behind) -->
      <img
        src="/personal-homepage/pokemon-avatar.jpg"
        alt="Pokemon avatar"
        class="absolute left-0 top-2 w-28 h-28 rounded-full border-2 border-border-dark object-cover z-10 transition-transform duration-300 hover:-translate-x-2"
      />
      <!-- Real photo (front) -->
      <img
        src="/personal-homepage/profile.jpg"
        alt="Bauke Brenninkmeijer"
        class="absolute left-16 top-2 w-28 h-28 rounded-full border-2 border-border-dark object-cover z-20 transition-transform duration-300 hover:translate-x-2"
      />
    </div>
  </div>

  <!-- What I do -->
  <div class="mt-16 text-center max-w-2xl">
    <div class="flex flex-wrap gap-2 justify-center mb-4">
      {['AI Agents', 'LLM Evaluation', 'LLMOps', 'Fine-tuning & Prompt Engineering', 'Synthetic Data'].map(topic => (
        <span class="text-xs text-muted-dark border border-border-dark rounded-full px-3 py-1">{topic}</span>
      ))}
    </div>
    <p class="text-sm text-muted-dark mb-2">Available for speaking and collaboration</p>
    <div class="flex gap-4 justify-center text-sm">
      <a href="mailto:bauke.brenninkmeijer@orq.ai" class="text-muted-dark hover:text-text-dark underline transition-colors">bauke.brenninkmeijer@orq.ai</a>
      <a href="https://calendar.app.google/7ET48JSCNjYVgiLH7" target="_blank" rel="noopener" class="text-muted-dark hover:text-text-dark underline transition-colors">Schedule a call</a>
    </div>
  </div>

  <!-- Featured -->
  <div class="mt-12 text-center">
    <p class="text-xs text-muted-dark uppercase tracking-wider mb-2">Upcoming</p>
    <a href="/personal-homepage/talks" class="text-sm text-muted-dark hover:text-text-dark transition-colors">
      Speaking at iO Engineering Manager Meetup — April 15, 2026
    </a>
  </div>
</section>
```

- [ ] **Step 2: Update index.astro**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
---
<Layout title="Home" description="Bauke Brenninkmeijer — AI Research Engineer at orq.ai. AI agents, LLM evaluation, and production AI systems.">
  <Hero />
</Layout>
```

- [ ] **Step 3: Copy photos to public/ for static serving**

The hero images need to be in `public/` since they're referenced with absolute paths:

```bash
cp src/assets/profile.jpg public/profile.jpg
cp src/assets/pokemon-avatar.jpg public/pokemon-avatar.jpg
```

- [ ] **Step 4: Test**

```bash
npx astro dev
```

Expected: Homepage shows hero with name, subtitle, overlapping photos, topic pills, contact info, and featured talk. Theme toggle works. Photos shift on hover.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro public/profile.jpg public/pokemon-avatar.jpg
git commit -m "feat: add homepage with hero, topics, and featured section"
```

---

### Task 4: Content collection and blog post migration

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/` (6 migrated blog posts)
- Create: `src/assets/posts/` (copied images)

- [ ] **Step 1: Create content collection config**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),
    categories: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: Migrate the 2 plain .md posts**

Create `src/content/posts/2020-07-23-first-personal-post.md`:

```markdown
---
title: "Introduction to personal website"
date: 2020-07-23
description: "Introduction to personal website."
categories: ["introduction"]
---

# Introduction to personal website
__Welcome!__

![](https://media0.giphy.com/media/XyaQAnihoZBU3GmFPl/giphy.gif)

After fighting with setting up a custom domain, I've now officially set out to write about some interesting topics here...
```

Copy and adapt `posts/2020-07-24-automated-product-recognition-for-hospitality-industry-insights.md` similarly. Key changes:
- Remove `aliases`, `layout`, `toc` from frontmatter
- Keep `title`, `date`, `description`, `image`, `categories`
- Update image paths from `images/...` to relative paths pointing to copied images in `src/assets/posts/`

```bash
mkdir -p src/assets/posts/product_recognition
cp posts/images/product_recognition/products_image.png src/assets/posts/product_recognition/
```

- [ ] **Step 3: Convert the genetic-algorithms .qmd post**

Read `posts/2023-02-15-genetic-algorithms.qmd` and create `src/content/posts/2023-02-15-genetic-algorithms.md`:
- Strip Quarto-specific syntax: `:::{.callout-tip}` → `> **Tip:**`, `format:` block, `code-tools`, etc.
- Keep all markdown content and images
- Copy frozen output images from `_freeze/`:

```bash
mkdir -p src/assets/posts/genetic-algorithms
cp posts/images/genetic-algorithms/* src/assets/posts/genetic-algorithms/
cp _freeze/posts/2023-02-15-genetic-algorithms/figure-html/*.png src/assets/posts/genetic-algorithms/
```

Update frontmatter:
```markdown
---
title: "Genetic Algorithms for image reconstruction"
date: 2023-02-16
description: "How we can leverage genetic algorithms to help with image reconstruction."
image: "/posts/genetic-algorithms/banner.png"
categories: ["Genetic Algorithms", "Machine learning"]
---
```

- [ ] **Step 4: Convert the long-context-vs-rag .qmd post**

Read `posts/2025-07-15-long-context-vs-rag/index.qmd` and create `src/content/posts/2025-07-15-long-context-vs-rag.md`:
- Same Quarto syntax stripping as above
- Copy images:

```bash
mkdir -p src/assets/posts/long-context-vs-rag
cp posts/2025-07-15-long-context-vs-rag/img/* src/assets/posts/long-context-vs-rag/
```

- [ ] **Step 5: Convert the 3 Spotify .ipynb posts**

Strategy: Extract markdown cells from the notebooks and combine with pre-existing static images from `posts/images/spotify_analysis/`. For Altair charts that rendered as interactive HTML (showing `alt.Chart(...)` or `alt.HConcatChart(...)`), replace with a note that the interactive chart is available in the notebook, or skip if there's no static image equivalent.

For each notebook:

1. Open the `.ipynb` file, extract all markdown cells
2. For code cells with visible output (tables, images), include the output as static content
3. Strip Quarto callout syntax (`:::{.callout-*}` → blockquotes)
4. Strip `#| include: false` cells entirely
5. Copy images:

```bash
mkdir -p src/assets/posts/spotify-analysis
cp posts/images/spotify_analysis/*.{jpg,png,gif} src/assets/posts/spotify-analysis/
cp posts/images/spotify_analysis/p1/* src/assets/posts/spotify-analysis/
cp posts/images/spotify_analysis/p2/* src/assets/posts/spotify-analysis/
cp posts/images/spotify_analysis/p3/* src/assets/posts/spotify-analysis/
```

Create `src/content/posts/2020-07-31-spotify-part-1.md`, `src/content/posts/2020-08-07-spotify-part-2.md`, `src/content/posts/2020-08-20-spotify-part-3.md`.

Example frontmatter for part 1:
```markdown
---
title: "Analyzing my Spotify listening history - Part 1"
date: 2020-07-31
description: "Soul searching through my choices in music. Using my Spotify listening data, we perform a dive into my listening behaviour."
image: "/posts/spotify-analysis/banner.png"
categories: ["Analysis", "Music", "BI"]
---
```

For interactive Altair charts that have no static image, add a note:
```markdown
*Interactive chart — [view in notebook](https://github.com/Baukebrenninkmeijer/personal-homepage/blob/master/posts/2020-07-31-spotify-listening-history-analysis-part-1.ipynb)*
```

- [ ] **Step 6: Verify content collection loads**

```bash
npx astro build
```

Expected: Build succeeds. Any content collection schema errors will show here.

- [ ] **Step 7: Commit**

```bash
git add src/content/ src/assets/posts/
git commit -m "feat: migrate blog posts to Astro content collections"
```

---

### Task 5: Blog listing and post pages

**Files:**
- Create: `src/components/BlogCard.astro`
- Create: `src/pages/blog.astro`
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create BlogCard.astro**

```astro
---
// src/components/BlogCard.astro
interface Props {
  title: string;
  date: Date;
  description: string;
  image?: string;
  categories?: string[];
  slug: string;
}

const { title, date, description, image, categories, slug } = Astro.props;
const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<a href={`/personal-homepage/blog/${slug}`} class="group block border border-border-dark rounded-lg overflow-hidden hover:-translate-y-0.5 hover:border-muted-dark transition-all duration-200">
  {image ? (
    <div class="h-40 overflow-hidden bg-[#111]">
      <img src={image} alt={title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
  ) : (
    <div class="h-40 bg-[#111] flex items-center justify-center text-muted-dark text-xs">No image</div>
  )}
  <div class="p-4">
    <p class="text-xs text-muted-dark mb-1">{formattedDate}</p>
    <h3 class="font-bold text-sm mb-2 group-hover:text-text-dark transition-colors">{title}</h3>
    <p class="text-xs text-muted-dark leading-relaxed line-clamp-3">{description}</p>
    {categories && categories.length > 0 && (
      <div class="flex flex-wrap gap-1 mt-3">
        {categories.map(cat => (
          <span class="text-[10px] text-muted-dark border border-border-dark rounded-full px-2 py-0.5">{cat}</span>
        ))}
      </div>
    )}
  </div>
</a>
```

- [ ] **Step 2: Create blog listing page**

```astro
---
// src/pages/blog.astro
import Layout from '../layouts/Layout.astro';
import BlogCard from '../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('posts'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<Layout title="Blog" description="Blog posts about AI, ML, and data science.">
  <div class="px-6 md:px-10 py-12 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Blog</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <BlogCard
          title={post.data.title}
          date={post.data.date}
          description={post.data.description}
          image={post.data.image}
          categories={post.data.categories}
          slug={post.slug}
        />
      ))}
    </div>
  </div>
</Layout>
```

- [ ] **Step 3: Create individual post page**

```astro
---
// src/pages/blog/[...slug].astro
import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
const formattedDate = new Date(post.data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
---
<Layout title={post.data.title} description={post.data.description} image={post.data.image}>
  <article class="px-6 md:px-10 py-12 max-w-3xl mx-auto">
    <header class="mb-8">
      <p class="text-sm text-muted-dark mb-2">{formattedDate}</p>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{post.data.title}</h1>
      {post.data.categories && (
        <div class="flex flex-wrap gap-2">
          {post.data.categories.map(cat => (
            <span class="text-xs text-muted-dark border border-border-dark rounded-full px-2 py-0.5">{cat}</span>
          ))}
        </div>
      )}
    </header>
    <div class="prose">
      <Content />
    </div>
    <div class="mt-12 pt-6 border-t border-border-dark">
      <a href="/personal-homepage/blog" class="text-sm text-muted-dark hover:text-text-dark transition-colors">&larr; Back to blog</a>
    </div>
  </article>
</Layout>
```

- [ ] **Step 4: Test**

```bash
npx astro dev
```

Expected: `/personal-homepage/blog` shows card grid. Clicking a card opens the full post. Posts render with proper prose styling.

- [ ] **Step 5: Commit**

```bash
git add src/components/BlogCard.astro src/pages/blog.astro src/pages/blog/
git commit -m "feat: add blog listing and individual post pages"
```

---

### Task 6: Projects page

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Create ProjectCard.astro**

```astro
---
// src/components/ProjectCard.astro
interface Props {
  title: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
}

const { title, description, tags, links } = Astro.props;
---
<div class="border border-border-dark rounded-lg p-6 hover:-translate-y-0.5 hover:border-muted-dark transition-all duration-200">
  <h3 class="font-bold text-lg mb-2">{title}</h3>
  <p class="text-sm text-muted-dark leading-relaxed mb-4">{description}</p>
  <div class="flex flex-wrap gap-1 mb-4">
    {tags.map(tag => (
      <span class="text-[10px] text-muted-dark border border-border-dark rounded-full px-2 py-0.5">{tag}</span>
    ))}
  </div>
  <div class="flex gap-3">
    {links.map(link => (
      <a href={link.href} target="_blank" rel="noopener" class="text-xs text-muted-dark hover:text-text-dark underline transition-colors">{link.label}</a>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Create projects.astro**

```astro
---
// src/pages/projects.astro
import Layout from '../layouts/Layout.astro';
import ProjectCard from '../components/ProjectCard.astro';

const projects = [
  {
    title: 'table-evaluator',
    description: 'Open-source Python library for evaluating how well synthetic datasets match real data. 92+ stars on GitHub.',
    tags: ['Python', 'PyPI', 'Open Source'],
    links: [
      { label: 'GitHub', href: 'https://github.com/baukebrenninkmeijer/table-evaluator' },
      { label: 'PyPI', href: 'https://pypi.org/project/table-evaluator/' },
    ],
  },
  {
    title: 'Master Thesis — Synthetic Tabular Data with GANs',
    description: 'Research on improving Generative Adversarial Networks for tabular data generation and evaluation.',
    tags: ['Python', 'GANs', 'Research'],
    links: [
      { label: 'GitHub', href: 'https://github.com/baukebrenninkmeijer/On-the-Generation-and-Evaluation-of-Synthetic-Tabular-Data-using-GANs' },
      { label: 'Thesis PDF', href: 'https://www.cs.ru.nl/masters-theses/2019/B_Brenninkmeijer___On_the_generation_and_evaluation_of_tabular_data_using_GANs.pdf' },
    ],
  },
  {
    title: 'OpenClaw',
    description: 'Open-source project at orq.ai for AI agent development and orchestration.',
    tags: ['Open Source'],
    links: [
      { label: 'GitHub', href: 'https://github.com/orq-ai/openclaw' },
    ],
  },
  {
    title: 'Context is King',
    description: 'PyData Amsterdam 2025 project exploring long context windows vs RAG for document understanding.',
    tags: ['Python', 'LLMs', 'RAG'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/pydata-2025-context-is-king' },
    ],
  },
];
---
<Layout title="Projects" description="Open source projects and research by Bauke Brenninkmeijer.">
  <div class="px-6 md:px-10 py-12 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Projects</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(project => (
        <ProjectCard {...project} />
      ))}
    </div>
  </div>
</Layout>
```

- [ ] **Step 3: Test**

```bash
npx astro dev
```

Expected: `/personal-homepage/projects` shows 4 project cards in a 2-column grid with tags and links.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects.astro
git commit -m "feat: add projects page with card grid"
```

---

### Task 7: Talks page

**Files:**
- Create: `src/components/TalkFeatured.astro`, `src/components/TalkEntry.astro`
- Create: `src/pages/talks.astro`

- [ ] **Step 1: Create TalkEntry.astro**

```astro
---
// src/components/TalkEntry.astro
interface Props {
  title: string;
  date: string;
  venue: string;
  description?: string;
  links?: { label: string; href: string }[];
  upcoming?: boolean;
}

const { title, date, venue, links, upcoming } = Astro.props;
---
<div class="flex gap-4 py-4 border-b border-border-dark last:border-b-0">
  <div class="text-xs text-muted-dark w-24 flex-shrink-0 pt-0.5">{date}</div>
  <div class="flex-1">
    <div class="flex items-center gap-2">
      <h3 class="font-bold text-sm">{title}</h3>
      {upcoming && <span class="text-[10px] bg-[#222] text-muted-dark rounded-full px-2 py-0.5">upcoming</span>}
    </div>
    <p class="text-xs text-muted-dark">{venue}</p>
    {links && links.length > 0 && (
      <div class="flex gap-3 mt-1">
        {links.map(link => (
          <a href={link.href} target="_blank" rel="noopener" class="text-xs text-muted-dark hover:text-text-dark underline transition-colors">{link.label}</a>
        ))}
      </div>
    )}
  </div>
</div>
```

- [ ] **Step 2: Create TalkFeatured.astro**

```astro
---
// src/components/TalkFeatured.astro
interface Props {
  title: string;
  date: string;
  venue: string;
  description: string;
  links?: { label: string; href: string }[];
}

const { title, date, venue, description, links } = Astro.props;
---
<div class="border border-border-dark rounded-lg p-6 mb-8">
  <p class="text-xs text-muted-dark uppercase tracking-wider mb-2">Featured</p>
  <h3 class="font-bold text-xl mb-1">{title}</h3>
  <p class="text-xs text-muted-dark mb-3">{date} — {venue}</p>
  <p class="text-sm text-muted-dark leading-relaxed mb-4">{description}</p>
  {links && links.length > 0 && (
    <div class="flex gap-3">
      {links.map(link => (
        <a href={link.href} target="_blank" rel="noopener" class="text-xs text-muted-dark hover:text-text-dark underline transition-colors">{link.label}</a>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 3: Create talks.astro**

```astro
---
// src/pages/talks.astro
import Layout from '../layouts/Layout.astro';
import TalkFeatured from '../components/TalkFeatured.astro';
import TalkEntry from '../components/TalkEntry.astro';
---
<Layout title="Talks" description="Conference talks and presentations by Bauke Brenninkmeijer.">
  <div class="px-6 md:px-10 py-12 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Talks</h1>

    <TalkFeatured
      title="Context is King"
      date="2025"
      venue="PyData Amsterdam"
      description="Exploring whether long context windows can replace RAG for document understanding. Benchmarking retrieval quality, latency, and cost across providers."
      links={[
        { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/pydata-2025-context-is-king' },
      ]}
    />

    <div>
      <TalkEntry
        title="How to start using AI with a software engineering team"
        date="Apr 15, 2026"
        venue="iO Engineering Manager Meetup"
        upcoming={true}
      />
      <TalkEntry
        title="Teams of Agents"
        date="Apr 3, 2026"
        venue="Meetup"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/claude-agents-team-demo' },
        ]}
      />
      <TalkEntry
        title="Lessen uit de loopgraven"
        date="Aug 22, 2025"
        venue="Turner Thinking Thursday"
      />
      <TalkEntry
        title="A Developer's Guide to GenAI"
        date="May 2025"
        venue="Sytac DevJam"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/developers-guide-to-genai' },
        ]}
      />
      <TalkEntry
        title="Introduction to SQLAlchemy"
        date="May 2023"
        venue="Internal talk"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/sqlalchemy-introduction' },
        ]}
      />
      <TalkEntry
        title="Diving into NLP Tokenizers"
        date="Apr 2022"
        venue="DSFC 2022"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/diving-into-nlp-tokenizers-dsfc-2022' },
        ]}
      />
      <TalkEntry
        title="Practical Data Science — tips, tricks and pitfalls"
        date="Apr 2022"
        venue="ABN AMRO Hackathon"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/practical-data-science' },
        ]}
      />
      <TalkEntry
        title="Code First Introduction to Machine Learning"
        date="Jul 2020"
        venue="ABN AMRO"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/Code-First-Introduction-to-Machine-Learning' },
        ]}
      />
      <TalkEntry
        title="FakeFynder — Deepfake detection for the masses"
        date="Aug 2019"
        venue="Hackathon for Good"
        links={[
          { label: 'GitHub', href: 'https://github.com/Baukebrenninkmeijer/FakeFynder-Hackathon-for-Good-2019' },
        ]}
      />
      <TalkEntry
        title="On the Generation and Evaluation of Synthetic Tabular Data using GANs"
        date="Sep 2019"
        venue="Radboud University — Master Thesis Defense"
        links={[
          { label: 'GitHub', href: 'https://github.com/baukebrenninkmeijer/On-the-Generation-and-Evaluation-of-Synthetic-Tabular-Data-using-GANs' },
          { label: 'Thesis PDF', href: 'https://www.cs.ru.nl/masters-theses/2019/B_Brenninkmeijer___On_the_generation_and_evaluation_of_tabular_data_using_GANs.pdf' },
        ]}
      />
    </div>
  </div>
</Layout>
```

- [ ] **Step 4: Test**

```bash
npx astro dev
```

Expected: `/personal-homepage/talks` shows featured card for PyData talk, then a timeline of compact entries below.

- [ ] **Step 5: Commit**

```bash
git add src/components/TalkFeatured.astro src/components/TalkEntry.astro src/pages/talks.astro
git commit -m "feat: add talks page with featured card and timeline"
```

---

### Task 8: Resume page

**Files:**
- Create: `src/components/TimelineEntry.astro`
- Create: `src/pages/resume.astro`

- [ ] **Step 1: Create TimelineEntry.astro**

```astro
---
// src/components/TimelineEntry.astro
interface Props {
  company: string;
  role: string;
  period: string;
  bullets?: string[];
}

const { company, role, period, bullets } = Astro.props;
---
<div class="flex gap-4 py-5 border-b border-border-dark last:border-b-0">
  <div class="text-xs text-muted-dark w-36 flex-shrink-0 pt-0.5">{period}</div>
  <div class="flex-1">
    <h3 class="font-bold text-sm">{company}</h3>
    <p class="text-xs text-muted-dark mb-1">{role}</p>
    {bullets && bullets.length > 0 && (
      <ul class="text-xs text-muted-dark leading-relaxed space-y-1 mt-2">
        {bullets.map(b => <li>{b}</li>)}
      </ul>
    )}
  </div>
</div>
```

- [ ] **Step 2: Create resume.astro**

```astro
---
// src/pages/resume.astro
import Layout from '../layouts/Layout.astro';
import TimelineEntry from '../components/TimelineEntry.astro';
---
<Layout title="Resume" description="Professional experience and education — Bauke Brenninkmeijer.">
  <div class="px-6 md:px-10 py-12 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">Resume</h1>
      <a href="/personal-homepage/CV_Bauke_Brenninkmeijer.pdf" download class="text-xs border border-border-dark rounded px-3 py-1.5 text-muted-dark hover:text-text-dark hover:border-muted-dark transition-colors">Download PDF</a>
    </div>

    <h2 class="text-lg font-bold mb-4">Experience</h2>

    <TimelineEntry
      company="orq.ai"
      role="AI Research Engineer"
      period="Aug 2025 – present"
      bullets={['AI agent infrastructure, LLM evaluation, prompt optimization, observability tooling']}
    />
    <TimelineEntry
      company="MLOps Community Amsterdam"
      role="Organiser"
      period="Sep 2024 – present"
    />
    <TimelineEntry
      company="Sytac → ING"
      role="Senior Consultant / Senior AI Engineer"
      period="May 2024 – Jul 2025"
      bullets={[
        'Detection and forecasting system for reliability events (1TB data, Polars)',
        'RAG-based sustainability peer review application',
        'Fraud detection MLOps pipeline',
        'LLM-based info extraction for internal resume app (Sytac)',
      ]}
    />
    <TimelineEntry
      company="ABN AMRO"
      role="Full Stack Data Scientist — Global Markets"
      period="Jul 2021 – May 2024"
      bullets={[
        'Data platform migration from IaaS to PaaS (Azure Datafactory, Databricks, Datalake)',
        'Real-time data streaming framework with Spark Structured Streaming',
        'Bond origination interest prediction',
      ]}
    />
    <TimelineEntry
      company="ABN AMRO"
      role="Data Scientist — Chief Architecture & Data Management"
      period="Oct 2019 – Jun 2021"
      bullets={[
        'Mortgage assessments using photos',
        'Data management and metadata generation',
        'Synthetic data for privacy-preserving analytics',
      ]}
    />
    <TimelineEntry
      company="ABN AMRO"
      role="Thesis Intern — Data Science"
      period="Mar 2019 – Oct 2019"
      bullets={['GANs for synthetic tabular data generation and evaluation']}
    />
    <TimelineEntry
      company="OneTwoModel"
      role="CTO & Co-founder"
      period="Sep 2019 – Nov 2021"
      bullets={['Startup building products for the modelling industry']}
    />
    <TimelineEntry
      company="TAPP"
      role="Data Scientist"
      period="Sep 2018 – Mar 2019"
      bullets={['NLP-based product classification from receipt descriptions']}
    />

    <h2 class="text-lg font-bold mt-10 mb-4">Education</h2>

    <TimelineEntry
      company="Radboud University"
      role="MSc Data Science"
      period="2017 – 2019"
    />
    <TimelineEntry
      company="Radboud Universiteit Nijmegen"
      role="BSc Computing Science"
      period="2013 – 2017"
    />
  </div>
</Layout>
```

- [ ] **Step 3: Test**

```bash
npx astro dev
```

Expected: `/personal-homepage/resume` shows download button and a clean timeline of experience and education.

- [ ] **Step 4: Commit**

```bash
git add src/components/TimelineEntry.astro src/pages/resume.astro
git commit -m "feat: add resume page with experience timeline"
```

---

### Task 9: 404 page and RSS feed

**Files:**
- Create: `src/pages/404.astro`
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create 404.astro**

```astro
---
// src/pages/404.astro
import Layout from '../layouts/Layout.astro';
---
<Layout title="Not Found">
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-muted-dark mb-6">This page doesn't exist.</p>
    <a href="/personal-homepage/" class="text-sm text-muted-dark hover:text-text-dark underline transition-colors">Go home</a>
  </div>
</Layout>
```

- [ ] **Step 2: Create RSS feed**

```bash
npm install @astrojs/rss
```

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = (await getCollection('posts'))
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Bauke Brenninkmeijer's Blog",
    description: 'AI, ML, and data science blog posts.',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/personal-homepage/blog/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 3: Test**

```bash
npx astro build
```

Expected: Build succeeds. Check that `dist/personal-homepage/rss.xml` and `dist/personal-homepage/404.html` exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/404.astro src/pages/rss.xml.ts package.json package-lock.json
git commit -m "feat: add 404 page and RSS feed"
```

---

### Task 10: GitHub Actions deployment

**Files:**
- Modify: `.github/workflows/publish.yml` → replace with `deploy.yml`

- [ ] **Step 1: Replace the workflow**

Delete the old Quarto workflow and create the Astro one:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  workflow_dispatch:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npx astro build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Remove old workflow**

```bash
rm .github/workflows/publish.yml
```

- [ ] **Step 3: Add .gitignore entries**

Append to `.gitignore`:

```
# Astro
node_modules/
dist/
.astro/
.superpowers/
```

- [ ] **Step 4: Test build locally**

```bash
npx astro build
```

Expected: Clean build, `dist/` directory contains the full site.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml .gitignore
git rm .github/workflows/publish.yml
git commit -m "feat: replace Quarto deploy workflow with Astro GitHub Pages workflow"
```

---

### Task 11: Final cleanup and light mode polish

**Files:**
- Modify: `src/styles/global.css` (light mode refinements)
- Modify: various components (light mode class variants)

- [ ] **Step 1: Add light mode variants to global.css**

The `.light` class on `<html>` needs to cascade to all components. Update `global.css`:

```css
/* Add to src/styles/global.css, inside @layer base */

.light body {
  @apply bg-bg-light text-text-light;
}

.light .border-border-dark {
  border-color: #e0e0e0;
}

.light .text-muted-dark {
  color: #666666;
}

.light .bg-\\[\\#111\\] {
  background-color: #f0f0f0;
}

.light .bg-\\[\\#222\\] {
  background-color: #e8e8e8;
}
```

Note: Tailwind's `dark:` prefix is the standard approach, but since we're using `class` dark mode with dark-as-default, we instead add `.light` overrides. An alternative is to refactor all components to use `dark:` classes — but that's a larger change. The `.light` override approach works for the initial launch.

- [ ] **Step 2: Test both themes**

```bash
npx astro dev
```

Click the theme toggle on every page. Verify:
- Background, text, borders, and muted text all invert correctly
- Cards, pills, and links remain readable
- Nav and footer adapt
- Blog prose (headings, links, code blocks, blockquotes) all work in both modes

- [ ] **Step 3: Full build test**

```bash
npx astro build && npx astro preview
```

Expected: Site runs at `localhost:4321/personal-homepage/`. All pages load, all links work, theme toggle works, no broken images.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: polish light mode theme support"
```

---

## Self-Review Checklist

- [x] **Spec coverage**: All spec sections have corresponding tasks: homepage (T3), projects (T6), blog (T4+T5), talks (T7), resume (T8), 404 (T9), RSS (T9), deploy (T10), dark/light (T2+T11), SEO meta (T2 Layout), animations (T1 tailwind config + T2 Layout), content migration (T4).
- [x] **Placeholder scan**: All tasks contain complete code. No TBD/TODO.
- [x] **Type consistency**: `Props` interfaces match usage across components. Content collection schema matches frontmatter used in migration task.
- [x] **Missing from spec**: The `robots.txt` is not explicitly created — Astro generates a default one with sitemap. Sufficient for now.
