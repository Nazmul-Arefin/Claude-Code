# Red Bolt IT — Website Redesign

A modern, dark, glassmorphism redesign of the Red Bolt IT agency website.
Plain HTML, CSS and JavaScript — no build step, no dependencies.

## Preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .        # or: python3 -m http.server
```

Screenshots of every section (desktop + mobile) are in `screenshots/`.

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Page structure and content |
| `styles.css` | Design tokens, glassmorphism, gradients, layout, responsive rules |
| `script.js`  | Scroll reveals, counters, rotating headline, cursor glow, card spotlight, 3D hero tilt, portfolio filter, form validation |

**Sections:** sticky glass nav · hero with animated 3D browser mockup · tech marquee ·
services bento grid · animated stats · filterable portfolio · 4-step process ·
why-us · FAQ accordion · contact form · footer.

**Quality:** responsive at 375 / 768 / 1024 / 1440px, keyboard-accessible with visible
focus, mobile menu with Escape-to-close, and all motion disabled under
`prefers-reduced-motion`.

## Before going live — replace placeholders

Search the HTML for `PLACEHOLDER` and `TODO`:

- **Stats** (120+ projects, 60+ clients, 8 countries, 98% retention) — use your real numbers.
- **Portfolio** — swap the four sample project cards for real case studies and screenshots.
- **Contact details** — confirm `hello@redboltit.com` and the location.
- **Social links** in the footer.
- **Contact form** — `script.js` only simulates sending; connect it to your backend or a
  form service (Formspree, Netlify Forms, etc.).
- **Hero mockup numbers** (+148%, 98) are decorative; adjust if you want to show real results.

## Brand colors

Edit the tokens at the top of `styles.css`:

```css
--red: #ff3d5a;  --orange: #ff8a3d;  --violet: #8b5cf6;  --pink: #ec4899;
```
