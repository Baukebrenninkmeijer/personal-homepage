# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog for Bauke Brenninkmeijer, built with [Quarto](https://quarto.org/). Deployed to GitHub Pages via the `gh-pages` branch.

## Commands

```bash
quarto preview          # Local dev server with hot reload
quarto render           # Full site build (output to _site/)
quarto render <file>    # Render a single page (e.g. quarto render posts/my-post.qmd)
```

## Architecture

- **Quarto website project** configured in `_quarto.yml` — defines navbar, theme, analytics, and freeze settings.
- **Posts** live in `posts/` as `.qmd`, `.md`, or `.ipynb` files. Each post uses YAML frontmatter for metadata. Post-level defaults are in `posts/_metadata.yml`.
- **Freeze**: Computational output is frozen (`execute: freeze: auto` globally, `freeze: true` for posts). Frozen results are stored in `_freeze/`. This means notebooks don't re-execute on render unless their source changes.
- **Theming**: Light/dark themes based on the `lux` Bootswatch theme, customized via `styles/theme-light.scss`, `styles/theme-dark.scss`, and `styles/styles.scss`.
- **Deployment**: Push to `master` triggers `.github/workflows/publish.yml`, which renders and publishes to `gh-pages`.
- **`archive/`**: Old Jekyll-based site (superseded by Quarto). Not part of the current build.
