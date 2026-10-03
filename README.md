# ZeroStore

**Sell a digital product from GitHub Pages — no domain, no server, no monthly fees.**

ZeroStore is a free, MIT-licensed storefront kit: edit one `config.json`, push, and a GitHub
Action publishes a fast landing page with a Gumroad, Lemon Squeezy or Payhip checkout,
plus `sitemap.xml`, `robots.txt`, Open Graph tags and JSON-LD product data.

It's also a **public experiment**: two AI agents (and one human who approves what ships) are
trying to make **$500 in 30 days starting from zero audience** — using this kit. Every number
is published, including the zeros.

→ **Site & live progress:** https://astonysh.github.io/zerostore/
→ **Daily log:** https://astonysh.github.io/zerostore/log/

## Quick start

```bash
npx degit astonysh/zerostore/kit my-store
cd my-store
# edit config.json — name, price, CHECKOUT_URL, copy, FAQ
node scripts/build.mjs        # optional local preview → dist/index.html
git init && git add -A && git commit -m "my store"
# push to GitHub, then Settings → Pages → Source: GitHub Actions
```

Your store is live at `https://<you>.github.io/<repo>/`.
Payment setup takes about 10 minutes: [kit/docs/payment-setup.md](kit/docs/payment-setup.md).

## What's in the free kit

- **One-file landing page** — hero, features, what's included, price card, FAQ. Dark and
  light themes, inline CSS, no framework.
- **Checkout that just works** — Gumroad overlay, Lemon Squeezy overlay, or a plain Payhip
  link. Switch with one config field.
- **SEO basics** — canonical URL, Open Graph, JSON-LD `Product`, generated sitemap and
  robots.txt.
- **Zero-dependency build** — a single Node script, run by GitHub Actions. Nothing to `npm install`.
- **Optional analytics** — GoatCounter (privacy-friendly, free), off by default.
- **Fails loudly** — the build refuses to deploy if your checkout URL or required fields are missing.

## ZeroStore Pro (paid, optional)

The playbook the agents are actually using to find, build and launch products:

- 6 agent skills in the open SKILL.md format (Claude Code, Codex CLI, Cursor, Gemini CLI):
  niche research, product builder, landing copy, SEO pages, launch posts, daily log
- Gumroad license-key verification for Node, Python and the browser
- Launch playbook with 20+ post templates and a subreddit rules cheat sheet
- The full experiment data at day 30

$29 launch price (then $49) → https://astonysh.github.io/zerostore/#pricing

The free kit is complete on its own. Pro is for people who want the agent workflow.

## Repo layout

```
index.html, assets/   the ZeroStore site (served at astonysh.github.io/zerostore/)
log/                  the public experiment log + data.json (revenue, orders, visitors)
demo/                 stores built with the kit during the experiment
kit/                  ← the free storefront kit (copy this)
```

## Honesty rules for this experiment

- Revenue, orders and spend in `log/data.json` are copied from the payment dashboard. Git
  history shows every change.
- No fake testimonials, no paid upvotes, no sock-puppet accounts.
- Nothing here is a promise of income.

## License

MIT — see [LICENSE](LICENSE).
