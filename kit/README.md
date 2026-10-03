# ZeroStore kit

A one-page storefront for a digital product, hosted free on GitHub Pages.
Edit `config.json`, push, done.

```bash
npx degit astonysh/zerostore/kit my-store
cd my-store
node scripts/build.mjs   # local preview: open dist/index.html
```

## Files

| File | What it does |
|---|---|
| `config.json` | Everything you edit: name, price, `CHECKOUT_URL`, copy, features, FAQ, theme, analytics |
| `src/template.html` | The page template. Single file, inline CSS, no JavaScript framework |
| `scripts/build.mjs` | Zero-dependency build: renders the page and writes `sitemap.xml` + `robots.txt` to `dist/` |
| `.github/workflows/pages.yml` | Builds and deploys to GitHub Pages on every push to `main` |
| `docs/payment-setup.md` | Gumroad, Lemon Squeezy and Payhip setup in ~10 minutes |
| `assets/` | Put `og.png` (1200×630 or 1280×720) and any images here; copied to `dist/assets/` |

## Deploy

1. Create a GitHub repo and push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow publishes to `https://<you>.github.io/<repo>/`. Put that URL in `site.url`.

## Config reference

| Key | Notes |
|---|---|
| `CHECKOUT_URL` | Your product's checkout link (must be `https://`) |
| `checkout_provider` | `gumroad` (overlay), `lemonsqueezy` (overlay), `payhip` or `link` (plain link) |
| `site.theme` | `dark` or `light` |
| `site.accent` | Any CSS color for buttons and highlights |
| `product.compare_at_price` | Optional crossed-out price. Only use it for a real previous or future price |
| `analytics.goatcounter` | Your GoatCounter code (e.g. `mystore`) to enable privacy-friendly stats. Empty = off |

The build stops with an error if required fields are missing, so you never deploy a store
with a broken buy button.

## License

MIT
