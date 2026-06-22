# TSD-UI-TOWER

Tower Console UI — built from the TSD UI Template.

## Tooling

- **Package manager**: NPM
- **Build Tool**: Vite
- **Core UI**: ReactJS
- **Server State Management**: TanStack Query
- **Linting**: Eslint
- **Formatting**: Prettier
- **Testing**: Vitest

## Environment Variables

| Variable          | Default                   | Description                                                                                                                      |
|-------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `BASE_URL`        |                           | Base URL path for Vite and branding asset resolution                                                                             |
| `TEMPLATE_ENGINE` |                           | Set to `"on"` to skip EJS resolution at build time and instead rename `index.html` to `index.html.ejs` for server-side rendering |
| `NODE_ENV`        | `"production"`            | Application mode: `"development"`, `"production"`, or `"test"`                                                                   |
| `PORT`            | `8080`                    | Server listening port                                                                                                            |
| `API_URL`         | `"http://localhost:8080"` | Target URL for the UI server's `/api` proxy. **Required** in container mode                                                      |
| `VERSION`         | `"99.0.0"`                | Application version                                                                                                              |
| `BRANDING`        | `"./branding"`            | Path to branding assets relative to the project root                                                                             |
| `GITHUB_TOKEN`    |                           | GitHub Personal Access Token for the PR monitoring script. Requires `repo` scope (classic) or read access to pull requests (fine-grained) |

## Scripts

The `scripts` workspace contains data pipeline tools. Currently it includes a GitHub PR monitoring pipeline that fetches open pull requests across configured organizations and repositories.

### Usage

```bash
npm run build -w scripts

GITHUB_TOKEN="ghp_..." node scripts/dist/cli.mjs
```

By default, config is read from `config/sources.yaml` and output is written to `data.json`. Override with `--config-dir=<path>` and `--output=<path>`.

### Configuration

The pipeline is configured via `config/sources.yaml`:

- **`sources.orgs`** — GitHub organizations to scan. All non-archived repos in each org are discovered automatically.
- **`sources.repos`** — Additional repositories to monitor (e.g. repos in orgs you don't want to fully scan).
- **`authors`** — Team members whose PRs are always shown, even in repos outside the configured orgs.
