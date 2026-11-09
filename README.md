# [Site Title] — Public Evidence Archive

A static website for documenting evidence, timelines, sources, and archived
documents. Hosted on GitHub Pages. Plain HTML, CSS, and a small amount of
vanilla JavaScript — no frameworks, no npm, no build step.

## Folder structure

```
/
├── index.html            Homepage (hero, intro, key evidence, timeline preview,
│                         documents, methodology, closing, footer)
├── evidence/index.html   Evidence index (filterable cards, one per item)
├── timeline/index.html   Chronological timeline
├── documents/index.html  Archived / downloadable documents table
├── sources/index.html    Source list, methodology, corrections policy
├── assets/
│   ├── css/style.css     All styles; colours/fonts set as variables in :root
│   └── js/main.js        Mobile menu, dark/light toggle, list filter, footer year
├── .nojekyll             Tells GitHub Pages to serve files as-is (no Jekyll)
└── README.md
```

Each section lives in its own folder as `index.html`, giving clean URLs
(`/evidence/`, `/timeline/`, …). All links are relative, so the site works
both at a custom domain and at `username.github.io/repo-name/`.

## Content conventions

- **Placeholders** are wrapped in `<div class="placeholder">` and shown with a
  dashed, hatched box labelled "Placeholder". Square brackets (`[Like this]`)
  mark values still to be filled in. Search for `placeholder` and `[` before
  publishing to find anything unfinished.
- **IDs** — every item gets a stable ID used as its HTML `id` so it can be
  linked directly:
  - Evidence: `EV-0001` → `evidence/#ev-0001`
  - Timeline: `t-0001` → `timeline/#t-0001`
  - Documents: `DOC-0001` → `documents/#doc-0001`
  - Sources: `SRC-0001` → `sources/#src-0001`
  Never reuse or renumber an ID once published.
- **Every evidence item must link to its original source and an archived
  copy** (e.g. a web archive snapshot). Record the date accessed in the
  sources table.
- No claim, quote, or statistic should be added without a source entry.

## Weekly update workflow

1. Add the source to `sources/index.html` (copy the template row).
2. If there is a file, put it in `documents/files/` (create the folder the
   first time) and add a row to `documents/index.html`.
3. Add the evidence card to `evidence/index.html` (copy the template
   `<article>`), linking the source and archived copy.
4. Add a dated entry to `timeline/index.html` if relevant.
5. Update the homepage "Key evidence" / timeline preview and the
   "Last updated" date in the hero.
6. Preview locally, then commit with a descriptive message
   (e.g. `Add EV-0012: …`) and push.

Each page has an HTML comment above its list explaining the template.

## Previewing locally

Open `index.html` directly in a browser, or for accurate relative-link
behaviour run a simple local server from the repo root, e.g.:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Publishing on GitHub Pages

1. Push the repository to GitHub.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Optional: add a custom domain (creates a `CNAME` file).

## Accessibility notes

Skip link, semantic landmarks, visible focus outlines, high-contrast palette,
system dark mode support with manual toggle, reduced-motion respect, and
tables with header scopes. Keep heading order logical when adding content.
