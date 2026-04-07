# Publishing

## Package identity

- npm package: `markdown-renderer-cli`
- CLI binary: `markdown-renderer-cli`
- GitHub repo: `https://github.com/elad12390/markdown-renderer`

## Why the package name differs

`markdown-renderer` is already taken on npm, so this package is prepared for publication as `markdown-renderer-cli`.

That gives a consistent first-release UX:

```bash
npx markdown-renderer-cli render --in input.md --out output.html --mode static
bunx markdown-renderer-cli render --in input.md --out output.html --mode static
```

If you later acquire the unscoped `markdown-renderer` package name, you can rename both the package and the binary in a follow-up release.

## First release checklist

1. Ensure the repo on GitHub is the canonical source:
   - `https://github.com/elad12390/markdown-renderer`
2. Ensure the package passes the full local gate:

   ```bash
   pnpm exec playwright install chromium
   pnpm check
   npm publish --dry-run --access public
   ```

3. Log in to npm locally if you need to perform the initial manual publish:

   ```bash
   npm login
   ```

4. Publish the package once manually to create it on npm:

   ```bash
   npm publish --access public
   ```

5. After the package exists on npm, configure trusted publishing on npmjs.com for:
   - owner: `elad12390`
   - repo: `markdown-renderer`
   - workflow: `.github/workflows/release.yml`

6. Future releases can then use the GitHub Actions release workflow triggered by version tags.

## Trusted publishing workflow

The repo already includes:

- `.github/workflows/release.yml`

It is configured to:

1. install dependencies
2. install Playwright Chromium
3. run the full quality gate
4. publish with:

```bash
npm publish --provenance
```

## Release flow after trusted publishing is configured

1. Bump version:

```bash
pnpm release
```

2. Push the version tag:

```bash
git push --follow-tags
```

3. Let GitHub Actions publish the release.

## Verification before each release

Use this exact sequence:

```bash
pnpm exec playwright install chromium
pnpm check
npm publish --dry-run --access public
```
