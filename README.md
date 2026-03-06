# m0x6a portfolio blog

CLI-inspired portfolio and Git-backed blog for Mattias Jonsson (`m0x6a`), built with Next.js App Router.

## Development

```bash
npm install
npm run dev
```

The site runs on `http://localhost:3000`.

## Blog source configuration

The application supports two source modes:

- `local` (default): reads Markdown posts from `content/blog`
- `github`: reads Markdown posts from a GitHub repository over the server-side API adapter

Create `.env.local` from `.env.example` if you want to override the defaults.

## Azure deployment

This repository now includes:

- `infra/azure/main.bicep` for Azure App Service infrastructure
- `.github/workflows/deploy-azure-webapp.yml` for GitHub Actions CI and deployment
- `scripts/package-azure-webapp.mjs` to stage a standalone Next.js bundle for App Service

### GitHub environment setup

Create a GitHub environment (defaults to `production`) and add:

**Secrets**

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `BLOG_SOURCE_TOKEN` if the blog source repo is private

**Variables**

- `AZURE_RESOURCE_GROUP`
- `AZURE_APP_NAME`
- `AZURE_APP_SERVICE_PLAN_NAME` (optional, defaults to `<app-name>-plan`)
- `AZURE_LOCATION` (optional, defaults to `swedencentral`)
- `GITHUB_DEPLOYMENT_ENVIRONMENT` (optional, defaults to `production`)
- `BLOG_SOURCE_PROVIDER` (`local` or `github`)
- `BLOG_SOURCE_PATH`
- `BLOG_SOURCE_OWNER` and `BLOG_SOURCE_REPO` when using `github`
- `BLOG_SOURCE_BRANCH` (optional, defaults to `main`)

### Manual infrastructure deployment

Provision the Azure resources from a workstation that is already authenticated to Azure:

```bash
az deployment group create \
  --resource-group <resource-group> \
  --template-file infra/azure/main.bicep \
  --parameters \
    appName=<globally-unique-app-name> \
    appServicePlanName=<app-service-plan-name> \
    location=<azure-region>
```

The GitHub Actions workflow handles linting, tests, `next build`, packaging, infrastructure reconciliation, and zip deployment on pushes to `main`.

## Checks

```bash
npm run lint
npm run test
npm run build
npm run package:azure
```

## Content contract

Each blog post must be a Markdown file with front matter:

```md
---
title: "Post title"
publishedAt: "2026-03-06"
summary: "Short summary shown on the index page."
slug: "optional-custom-slug"
---
```

If `slug` is omitted, the route is derived from the filename.
