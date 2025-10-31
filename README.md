# Gene Website

This package contains the static website for the Gene programming language. It is built with [Astro](https://astro.build)
and deployed to [gene-lang.github.io](https://gene-lang.github.io) via GitHub Pages (with the option to add `genelang.org` as a custom domain).

## Structure

```
website/
├── public/               # Static assets (served as-is)
├── src/
│   ├── layouts/          # Shared page layouts and navigation
│   ├── pages/            # Astro pages and Markdown/MDX content
│   │   ├── docs/         # Documentation index and placeholders
│   │   ├── examples/     # Curated code examples (static rendering only)
│   │   └── tutorials/    # Tutorial roadmap and status
│   └── styles/           # (Optional) global styles
├── astro.config.mjs      # Astro configuration
├── package.json          # Build scripts and dependencies
└── tsconfig.json         # TypeScript settings for editor tooling
```

## Prerequisites

- Node.js 18+ (Astro recommends 18.17 or 20+)
- npm (bundled with Node.js)
- Optional: locally built Gene CLI (`./gene/bin/gene`) if you want to run the showcased Gene snippets

## Local development

```bash
cd website
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`. Astro supports hot module reloading for `.astro`, `.md`, and `.css`
files, so edits appear immediately.

## Building for production

```bash
npm run build
npm run preview   # Optional: serve the generated site from ./dist
```

The build artefacts are emitted to `website/dist/`. Deploy the contents of this directory to any static hosting service
(GitHub Pages, Netlify, Vercel, S3/CloudFront, etc.).

## Content guidelines

- Code listings are rendered statically and never executed in the browser.
- Port documentation from `gene/docs/` into `src/pages/docs/` using OpenSpec proposals for substantial changes.
- Prefer Markdown (`.md`/`.mdx`) for long-form documentation and `.astro` files for interactive layouts or custom
  components.
- Keep featured snippets runnable; from the workspace root you can validate them with:
  ```bash
  ./gene/bin/gene eval '<gene-code>'
  ```

## Deployment checklist

1. Run `npm run build` and ensure it succeeds without warnings.
2. Validate links and accessibility using `npm run astro -- check`.
3. Push to `main`; GitHub Actions (see `.github/workflows/deploy-website.yml`) builds and publishes to Pages.
4. Verify https://gene-lang.github.io (or the configured custom domain) on desktop and mobile viewports.

## Publishing under the `gene-lang` organization

To host the website at `https://gene-lang.github.io` using the `gene-lang` GitHub organization:

1. **Create the Pages repository**
   - In the `gene-lang` org, create a public repository named `gene-lang.github.io`.
   - Leave it empty (no README/gitignore/license) so you can push an existing history.

2. **Populate the repository**
   - From this workspace root, run:
     ```bash
     git subtree split --prefix=website -b website-public
     ```
   - Add the new repository as a remote and push the subtree:
     ```bash
     git remote add gene-lang-pages https://github.com/gene-lang/gene-lang.github.io.git
     git push gene-lang-pages website-public:main
     git branch -D website-public
     ```
   - Alternatively, clone the new repository separately and copy the contents of `website/` into it.

3. **Enable GitHub Pages + Actions**
   - In the `gene-lang.github.io` repository settings → Pages, set the source to “GitHub Actions”.
   - Commit the workflow from `.github/workflows/deploy-website.yml` (or copy it into the new repo) so pushes to `main` build the Astro site and publish it.

4. **Update site metadata**
   - Ensure `astro.config.mjs` has `site: 'https://gene-lang.github.io'`.
   - If you plan to map `genelang.org`, add a `CNAME` file under `website/public/` with `genelang.org` and update DNS with a CNAME record pointing to `gene-lang.github.io`.

5. **Ongoing deployment**
   - Develop in this mono-repo (`gene-workspace`), keep `website/` updated, and periodically push the subtree to `gene-lang.github.io`.
   - Every push to `main` in the Pages repository will trigger the workflow and refresh the live site.
