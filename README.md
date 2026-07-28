# FF DIAMOND LOOT

A premium, mobile-first, dark cyberpunk gaming top-up website for **Free Fire Diamonds**, **BGMI UC** and **Google Play Gift Cards** — built with only hand-written HTML, CSS and vanilla JavaScript. No frameworks, no build tools, no dependencies. Works instantly on GitHub Pages.

---

## 📁 Project structure

```
ffdiamondloot/
├── index.html      → All page markup (hero, games, products, membership, payment, tracker, FAQ, footer)
├── style.css        → All styling, animations, variables, responsive rules
├── script.js        → All interactivity (search, filters, modal, tracker, toasts, particles, etc.)
├── assets/
│   └── upi-qr.png    → Your UPI QR code image (shown in the Payment section)
└── README.md         → This file
```

Everything is a static file — just open `index.html` in a browser, or deploy the whole folder as-is.

---

## 🚀 Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `ffdiamondloot`).
2. Upload all four files (`index.html`, `style.css`, `script.js`, `README.md`) plus the `assets/` folder to the repository root — either via the GitHub web UI ("Add file → Upload files") or with git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — FF Diamond Loot"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In your repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Pick the `main` branch and `/ (root)` folder, then click **Save**.
6. Wait 1–2 minutes — your site will be live at:
   `https://<your-username>.github.io/<your-repo>/`

No further configuration is needed. The site has no server, no database, and no build step.

---

## 🖼️ Replacing placeholder artwork

Every product/game card currently uses a **hand-coded placeholder** (a gradient block with a label like `IMAGE PLACEHOLDER` and a simple line icon) instead of copyrighted logos or artwork. This keeps the project safe to publish as-is.

To use your own licensed artwork:

1. Add your image files into the `assets/` folder (e.g. `assets/freefire-100.png`).
2. Open `script.js` and find the `PRODUCTS` array near the top (Section 2).
3. Add an `image` field to any product object, e.g.:
   ```js
   { id: 'ff-100', category: 'freefire', title: '100 Diamonds', desc: '...', price: 79, oldPrice: 99, badge: null, image: 'assets/freefire-100.png' }
   ```
4. In the `renderProducts()` function (Section 10), replace the placeholder `<div class="product-art placeholder-art">` block with an `<img>` tag when `p.image` exists, for example:
   ```js
   const artHTML = p.image
     ? `<img src="${p.image}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
     : `<svg class="ph-icon" ...>...</svg>`;
   ```
   Wrap that inside the existing `.product-art` container so badges/discount tags still overlay correctly.
5. Do the same for the three game cards in `index.html` (`.ph-freefire`, `.ph-bgmi`, `.ph-giftcard`) — just swap the inner `<svg class="ph-icon">` for an `<img>` tag pointing to your asset.

⚠️ **Important:** Only use artwork you own or are licensed to use. Do not use Garena/Free Fire, Krafton/BGMI or Google Play trademarks/logos without permission — this template intentionally avoids them.

---

## 🛒 How to edit products & prices

Open `script.js` and scroll to **Section 2 — PRODUCT DATA** (`const PRODUCTS = [...]`).

Each product is one object:

```js
{
  id: 'ff-310',            // unique ID — keep it unique
  category: 'freefire',     // 'freefire' | 'bgmi' | 'giftcard'
  title: '310 Diamonds',    // shown on the card
  desc: 'Popular starter pack for weekly events.',
  price: 229,                // current selling price (₹)
  oldPrice: 279,             // struck-through original price — omit or set to null to hide
  badge: 'popular'           // 'popular' | 'best' | 'hot' | 'recommended' | null
}
```

- **To add a product:** copy an existing object, change the `id`, and add it to the array.
- **To remove a product:** delete its object from the array.
- **To change a price:** edit the `price` / `oldPrice` numbers — the discount badge (`-XX%`) is calculated automatically.
- **To add/remove a badge:** set `badge` to one of the four values above, or `null` for none.
- **Membership plans** (Weekly / Monthly / Premium) live directly in `index.html` inside the `#membership` section — edit the `<h3>`, `.member-price`, and `<li>` perks directly, and update the `data-price` attribute on each `.buy-member` button.

Changes take effect immediately on page reload — no build step required.

---

## 💳 How to change your UPI ID

1. **Replace the QR code image:** generate a new UPI QR code (from your bank/UPI app) and replace `assets/upi-qr.png` with the new image (keep the same filename, or update the `src` in `index.html` under `#payment`).
2. **Update the visible UPI ID text:** open `script.js` and edit `CONFIG.upiId` near the top of the file:
   ```js
   const CONFIG = {
     upiId: '9557923807@fam',   // ← change this
     ...
   };
   ```
   This value is used by the **"Copy UPI ID"** button and the footer UPI display — it updates automatically everywhere.

---

## 💬 How to change your Telegram username

Open `script.js` and edit the `CONFIG` object:

```js
const CONFIG = {
  upiId: '9557923807@fam',
  telegramHandle: '@ffdiamondloot',        // ← shown as text
  telegramUrl: 'https://t.me/ffdiamondloot' // ← actual link target
};
```

Then also update the two hard-coded Telegram links in `index.html` (search for `t.me/ffdiamondloot`):
- The **"Contact Telegram Support"** button in the Payment section.
- The **"Telegram Support"** link in the Footer.

(These are kept as plain `<a href>` tags for reliability — update both to match your new handle.)

---

## 🎨 Customizing the theme

All colors, fonts, spacing and radii are defined as CSS variables at the top of `style.css` under `:root`:

```css
--purple:#b026ff;
--cyan:#00eaff;
--gold:#ffd24c;
--bg-black:#050308;
--font-display:'Orbitron', ...;
--font-body:'Rajdhani', ...;
```

Change any variable once and it updates across the entire site (buttons, gradients, glows, badges, text highlights, etc.).

---

## ✅ Features included

- Mobile-first responsive layout (works on all screen sizes, iPhone & Android)
- Premium animated loading screen
- Canvas particle background + animated grid overlay
- Sticky glassmorphism navbar with scroll state + mobile hamburger menu
- Animated hero with parallax, floating chips, orbiting rings and gradient text
- Auto-scrolling marquee strip
- Game category cards (Free Fire / BGMI / Google Play) with original placeholder artwork
- Filterable + live-searchable product grid with badges, discounts, hover animations
- Membership plan cards (Weekly / Monthly / Premium) with glow effects
- UPI payment section with QR code, one-tap "Copy UPI ID", step-by-step instructions, manual delivery notice, Telegram support link
- Animated order tracker with 4 stages (Order Received → Payment Verified → Processing → Completed)
- Animated counters, scroll-reveal effects, ripple button clicks, toast notifications
- Product detail modal with UID input
- FAQ accordion
- Privacy Policy / Terms modal
- Back-to-top button
- SEO meta tags, Open Graph tags, `loading="lazy"` on images, semantic/accessible HTML, visible focus states, `prefers-reduced-motion` support

---

## ⚠️ Disclaimer

This is a **template/demo storefront**. It has no backend, no real payment gateway integration, and no database — the "order tracker" and "checkout" are front-end simulations that direct the buyer to complete payment manually via UPI and confirm via Telegram, exactly as described on the page. Before running this as a real business, make sure you comply with your local laws regarding digital goods resale, payment handling, and platform terms of service (Garena, Krafton, Google, etc.), and that all artwork you use is properly licensed.

---

Built with plain HTML, CSS & JavaScript. No React, no Tailwind, no Bootstrap, no build step. 🚀
