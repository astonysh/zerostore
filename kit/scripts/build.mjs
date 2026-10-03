#!/usr/bin/env node
// ZeroStore build: config.json + src/template.html -> dist/{index.html,sitemap.xml,robots.txt}
// Zero dependencies. Run: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const cfg = JSON.parse(readFileSync(join(root, "config.json"), "utf8"));

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

// --- validation: fail loudly instead of shipping a broken store ---
const required = ["CHECKOUT_URL", "site.url", "site.title", "site.description", "product.name", "product.price", "product.cta_label", "hero.headline"];
const missing = required.filter((k) => !get(cfg, k));
if (missing.length) {
  console.error("config.json is missing: " + missing.join(", "));
  process.exit(1);
}
if (!/^https:\/\//.test(cfg.CHECKOUT_URL)) {
  console.error("CHECKOUT_URL must start with https://");
  process.exit(1);
}
if (cfg.site.url.includes("YOUR-GITHUB-NAME")) {
  console.warn("warning: site.url still contains YOUR-GITHUB-NAME — set it to your GitHub Pages URL before launch.");
}
const siteUrl = cfg.site.url.endsWith("/") ? cfg.site.url : cfg.site.url + "/";

// --- checkout provider ---
const provider = (cfg.checkout_provider || "link").toLowerCase();
let checkoutHref = cfg.CHECKOUT_URL;
let checkoutClass = "";
let checkoutAttrs = "";
const scripts = [];
if (provider === "gumroad") {
  // gumroad.js turns links to your product into an on-page overlay checkout.
  checkoutAttrs = 'data-gumroad-overlay-checkout="true"';
  scripts.push('<script src="https://gumroad.com/js/gumroad.js" defer></script>');
} else if (provider === "lemonsqueezy") {
  // lemon.js opens checkout as an overlay for links with this class and ?embed=1.
  const u = new URL(checkoutHref);
  u.searchParams.set("embed", "1");
  checkoutHref = u.toString();
  checkoutClass = "lemonsqueezy-button";
  scripts.push('<script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>');
} else if (provider !== "payhip" && provider !== "link") {
  console.error(`Unknown checkout_provider "${provider}". Use gumroad, lemonsqueezy, payhip or link.`);
  process.exit(1);
}

// --- optional privacy-friendly analytics ---
const gc = cfg.analytics?.goatcounter;
if (gc) {
  const code = gc.replace(/^https?:\/\//, "").replace(/\.goatcounter\.com.*$/, "");
  scripts.push(`<script data-goatcounter="https://${esc(code)}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`);
}

// --- blocks ---
const featuresHtml = (cfg.features || [])
  .map((f) => `        <div class="card"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`)
  .join("\n");
const includesHtml = (cfg.includes || []).map((i) => `          <li>${esc(i)}</li>`).join("\n");
const faqHtml = (cfg.faq || [])
  .map((f) => `      <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
  .join("\n");
const compareAt = cfg.product.compare_at_price ? ` <s>${esc(cfg.product.currency)}${esc(cfg.product.compare_at_price)}</s>` : "";
const ogImage = cfg.site.og_image ? new URL(cfg.site.og_image, siteUrl).toString() : "";

const jsonld = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  name: cfg.product.name,
  description: cfg.site.description,
  url: siteUrl,
  ...(ogImage && { image: ogImage }),
  offers: {
    "@type": "Offer",
    price: String(cfg.product.price),
    priceCurrency: cfg.product.currency_code || "USD",
    availability: "https://schema.org/InStock",
    url: cfg.CHECKOUT_URL,
  },
}).replace(/</g, "\\u003c");

const vars = {
  og_image_abs: ogImage,
  checkout_href: checkoutHref,
  checkout_class: checkoutClass,
  checkout_attrs: checkoutAttrs,
  compare_at_html: compareAt,
  features_html: featuresHtml,
  includes_html: includesHtml,
  faq_html: faqHtml,
  scripts_html: scripts.map((s) => "  " + s).join("\n"),
  jsonld,
};

// {{{raw}}} is inserted as-is; {{escaped}} is HTML-escaped. Lookups: vars first, then config paths.
const lookup = (k) => (k in vars ? vars[k] : get(cfg, k));
let html = readFileSync(join(root, "src", "template.html"), "utf8")
  .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, k) => String(lookup(k) ?? ""))
  .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => esc(lookup(k)));

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "index.html"), html);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${esc(siteUrl)}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`
);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
writeFileSync(join(out, ".nojekyll"), "");
if (existsSync(join(root, "assets"))) cpSync(join(root, "assets"), join(out, "assets"), { recursive: true });

console.log(`Built ${provider} store "${cfg.product.name}" -> dist/ (index.html, sitemap.xml, robots.txt)`);
