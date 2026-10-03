# Payment setup (about 10 minutes)

ZeroStore never touches card data. Your store page links to a hosted checkout, and the
platform takes the payment, delivers the file, and (for Gumroad and Lemon Squeezy) handles
sales tax / VAT as the merchant of record.

You only need **one** of the three options below. Then you change `CHECKOUT_URL` and
`checkout_provider` in `config.json`, and that's it.

| | Gumroad | Lemon Squeezy | Payhip |
|---|---|---|---|
| Fee (check their pricing page) | ~10% + $0.50 per sale, plus payment processing on direct sales | 5% + $0.50 per sale | Free plan: 5% per sale + Stripe/PayPal fees |
| Who handles sales tax / VAT | Gumroad | Lemon Squeezy | Payhip handles EU/UK VAT on digital goods; other taxes are on you |
| File delivery | ✓ | ✓ | ✓ |
| License keys | ✓ (verify API) | ✓ (license API) | ✓ (software license keys) |
| Overlay checkout on your page | ✓ `gumroad.js` | ✓ `lemon.js` | plain link |
| Signup speed | Instant | Store review; new signups may be slow while it moves to Stripe | Instant |
| `checkout_provider` value | `gumroad` | `lemonsqueezy` | `payhip` |

Fees and features change. Always confirm on the platform's own pricing page before you launch.

---

## Option A — Gumroad (recommended for speed)

1. Sign up at <https://gumroad.com/signup>.
2. **Settings → Payments**: enter your identity details and a payout method (bank account or
   PayPal, depending on your country). Payouts won't arrive until this is complete.
3. **Products → New product → Digital product**.
   - Name, price, cover image (1280×720 works well), description.
   - Upload your file (zip, PDF, xlsx…).
4. *(Optional, for software)* In the product's content settings, turn on
   **"Generate a unique license key per sale"**. Write down the **product ID** shown in the
   license key section — you need it for license verification.
5. **Share** tab: pick a category and keep ratings on. This only matters later — Gumroad
   Discover lists a product after your account has real sales and passes a review.
6. Publish and copy the product URL, e.g. `https://yourname.gumroad.com/l/my-product`.
7. In `config.json`:
   ```json
   "CHECKOUT_URL": "https://yourname.gumroad.com/l/my-product",
   "checkout_provider": "gumroad"
   ```
8. Push. Your buy buttons now open Gumroad's overlay checkout on your page.

**Test it:** create a 100%-off discount code in Gumroad, buy your own product with it,
confirm the download email arrives, then delete the code.

## Option B — Lemon Squeezy

1. Sign up at <https://app.lemonsqueezy.com/register> and create a **Store**. New stores go
   through a short review before they can take live payments.
2. **Settings → Payouts**: add a bank account or PayPal.
3. **Products → New product**: name, price, files. Under **Variants**, enable
   **License keys** if you need them.
4. Open the product → **Share** → copy the **checkout URL**
   (looks like `https://yourstore.lemonsqueezy.com/buy/xxxxxxxx`).
5. In `config.json`:
   ```json
   "CHECKOUT_URL": "https://yourstore.lemonsqueezy.com/buy/xxxxxxxx",
   "checkout_provider": "lemonsqueezy"
   ```
   The build adds `?embed=1` and loads `lemon.js`, so checkout opens as an overlay.
6. Test with Lemon Squeezy's **test mode** before you switch the store live.

## Option C — Payhip

1. Sign up at <https://payhip.com>.
2. **Settings → Payment**: connect **Stripe** and/or **PayPal**. Payhip pays you through
   those accounts, so you need at least one.
3. **Add product → Digital download**: name, price, file.
4. Copy the product link (looks like `https://payhip.com/b/AbCd`).
5. In `config.json`:
   ```json
   "CHECKOUT_URL": "https://payhip.com/b/AbCd",
   "checkout_provider": "payhip"
   ```

---

## Selling from outside the US

- **Payouts** depend on your country. Before launch, open your platform's payout settings
  and check that your country and your bank or PayPal account are supported.
- **Taxes**: merchant-of-record platforms (Gumroad, Lemon Squeezy) collect and remit sales tax
  and VAT on your sales. Your own income tax on what you earn is still your responsibility.
- **Currency**: prices are usually shown in USD; buyers pay in their card's currency and the
  platform converts. Your payout currency depends on your payout method.

## Checklist before you post your launch link

- [ ] `CHECKOUT_URL` points to the live product, not a draft
- [ ] Test purchase (discount code / test mode) worked and the file arrived
- [ ] Refund policy is stated on the page and matches the platform setting
- [ ] `site.url` in `config.json` is your real GitHub Pages URL
- [ ] Payout method is verified
