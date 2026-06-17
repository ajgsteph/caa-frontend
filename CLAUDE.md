@AGENTS.md
@../CLAUDE.md

# Code health — Fallow

This app uses [Fallow](https://fallow.tools) (JS/TS codebase intelligence) for dead-code,
duplication, and complexity analysis. Config: `.fallowrc.json`.

```bash
npx fallow                              # full analysis (dead-code + dupes + health)
npx fallow dead-code --format json --quiet || true
npx fallow audit --base origin/main --ci --fail-on-issues   # PR gate (changed files only)
```

The repo is kept clean under the policy in `.fallowrc.json`. Notable decisions:

- **Health thresholds**: cyclomatic 20, cognitive 15, **CRAP 420**. CRAP is widened from the
  default 30 because no test/runtime coverage is wired up, so CRAP degenerates to ~cyclomatic²
  and double-counts complexity; we gate on cyclomatic/cognitive directly. Revisit CRAP if coverage
  is ever added.
- **`components/ui/**`** is the vendored shadcn/ui kit — excluded from dead-code and health
  (`overrides` + `health.ignore`); its full API surface is retained intentionally.
- **Intentional exceptions** use the narrowest mechanism: `/** @expected-unused */` on exports
  reserved for future use (self-cleaning), `// fallow-ignore-file unused-file` on placeholder
  files, `ignoreDependencies` for retained deps. Prefer these over deleting future-use code.

Before adding a Fallow suppression, fix the issue in code if it's genuinely dead. New API calls go
through `lib/api/client.ts` (`backendFetch`); shared form pieces live in `components/custom-ui/`.
