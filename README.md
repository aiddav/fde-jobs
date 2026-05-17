# FDE Jobs

A static, repo-backed jobs board for Forward Deployed Engineers, Deployed Engineers, Solutions Engineers, and AI Solutions Engineers.

## Stack

- Astro 5 static site
- Preact islands for filtering, search, and theme toggle
- Tailwind CSS v4 runtime with project CSS tokens
- JSON files as the database
- GitHub Actions for ingestion and GitHub Pages deploy

## Local development

```sh
pnpm install
pnpm seed:companies
pnpm seed:jobs
pnpm dev
```

## Validation

```sh
pnpm validate:data
pnpm typecheck
pnpm lint
pnpm check:css
pnpm build
```

## Operations

Add `OPENAI_API_KEY` and `WORKFLOW_PAT` as GitHub repository secrets before enabling ingestion workflows. `WORKFLOW_PAT` is used because commits made with the default `GITHUB_TOKEN` do not retrigger downstream workflows.
