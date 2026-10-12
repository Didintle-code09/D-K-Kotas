# DK Spot — website

**Kota at its best. Monate!** · 13 Graduate St, Belhar 8, Cape Town

A static React + TypeScript site (Vite). Customers build a pickup order and send it to DK Spot on WhatsApp; delivery links out to Uber Eats. There's no backend, database, analytics, cookies or third-party embeds. Fonts (Fraunces, Figtree) are self-hosted from npm, so the site makes no requests to Google.

## Run it

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

Node 18 or newer. The npm scripts call Vite and TypeScript through `node` directly, so they also work in folders with special characters in the path (such as `D&K` on Windows).

## Editing content

**All business content lives in [`src/config.ts`](src/config.ts).** Components only read from it.

| What | Where in `config.ts` |
| --- | --- |
| WhatsApp number (digits only, e.g. `27821234567`) | `whatsappNumber` |
| WhatsApp number as shown on the site | `whatsappDisplay` (also fills the legal pages) |
| Opening hours (drive pickup slots, Open now / Closed and the footer) | `hours` |
| Menu items, prices, descriptions, "Most loved" featured items | `menu` |
| Instagram / TikTok links (empty = hidden) | `instagramUrl`, `tiktokUrl` |
| Hero mosaic / banner photos | `heroImages` (6: 3 × 2, first 4 on phones), `bannerImages` (3, first 1 on phones) |
| Menu item photos | `image` on each `menu` item (optional) |
| Legal "Last updated" date | `legalLastUpdated` |
| Terms / Privacy text | `terms`, `privacy` |
| All other on-screen wording | `copy` |

### Placeholders to confirm before launch

Every `[BRACKETED]` value is shown on the site on purpose until it is confirmed:

- `[27XXXXXXXXX]` / `[0XX XXX XXXX]`: WhatsApp number
- `[DATE]`: legal "Last updated" date
- `[30]` minutes (Terms §4) and `[3 months]` (Privacy §6)
- Opening hours: Google and Uber Eats disagree (see the `[CONFIRM]` comment)
- Photos: `public/images/kota-*.jpg` and `fries.jpg` are cropped from DK Spot's Uber Eats listing (~540 px). Replace them with high-res originals from the owner (same file names, ideally 1600 px+). Kota 4 and Kota 6 currently reuse the Kota 3 and Kota 5 photos, as on Uber Eats.

## Launch checklist

1. Replace every placeholder above, swap in high-res photos and check `heroImagesAlt` / `bannerImagesAlt` in `copy`.
2. In `index.html`, **remove the `noindex` meta tag** (marked `<!-- REMOVE noindex AT LAUNCH -->`).
3. Once confirmed, add `"telephone"` to the JSON-LD block in `index.html`.

## Deploying to Netlify

- Build command: `npm run build`
- Publish directory: `dist`

`public/_redirects` (`/* /index.html 200`) makes `/terms` and `/privacy` work on refresh.

## Structure

```
src/
  config.ts            all business content + copy + legal text
  App.tsx              routes (/, /terms, /privacy) + in-memory basket
  pages/               Home, LegalPage, NotFound
  components/          Navbar, Hero, MostLoved, Menu, OrderBanner, PreOrder,
                       FindUs, FloatingWhatsApp, Footer, …
  lib/hours.ts         Africa/Johannesburg time, open-now, pickup slots
  lib/order.ts         basket maths + WhatsApp message builder
  lib/scroll.ts        smooth section scrolling (respects reduced motion)
  styles.css           design tokens and all styles
```

---

Website by [Moratamotho Devs](https://moratamothodevs.co.za)
