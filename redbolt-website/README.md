# RedBolt IT — Website Redesign

An editorial, dark redesign of the RedBolt IT agency website: oversized
typography, aurora gradients, restrained glassmorphism and scroll-driven motion.
Plain HTML, CSS and JavaScript — no build step, no dependencies.

## Preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .        # or: python3 -m http.server
```

Screenshots (desktop + mobile) are in `screenshots/`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and content |
| `styles.css` | Design tokens, typography, glass, gradients, layout, responsive rules |
| `script.js`  | All motion and interaction |

## Sections & motion

- **Hero** — masked line-by-line headline reveal, rotating serif phrase, glass dashboard
  mockup on an animated aurora gradient that scales up on scroll and reacts to the mouse.
- **Clients** — infinite marquee of client names.
- **About** — statement that lights up word by word as you scroll, animated counters.
- **Services** — editorial numbered list with gradient hover sweep.
- **Products** — Amar Finance, Hello Campus, Bolt Mail cards with 3D tilt and animated bars.
- **Work** — pinned horizontal-scroll gallery on desktop, swipeable on mobile.
- **Process** — sticky stacking cards.
- **Why us, FAQ, Contact** — floating-label form with service chips, giant footer wordmark.
- Custom cursor, magnetic buttons, hide-on-scroll nav, film grain.
- Everything respects `prefers-reduced-motion`; layout tested at 390px and 1440px.

## Before going live

Content was gathered from search-engine excerpts of redboltit.com, so please verify:

- **Facts row** (10+ clients, 3 products, 6 services) — replace with real totals.
- **Work cards** — add real screenshots for Fariea International and the WooCommerce store.
- **Hero dashboard numbers** are decorative mock data.
- **"Why us" claims** (turnaround, pricing) — confirm they match how you work.
- **Social links** — LinkedIn / Instagram / Behance URLs are placeholders (`#`).
- **Contact form** — `script.js` only simulates sending; connect it to your backend or a
  service such as Formspree.

## Brand colors

Edit the tokens at the top of `styles.css`:

```css
--red: #ff3a2e;  --orange: #ff7a1a;  --violet: #7c3aed;  --rose: #f43f5e;
```
