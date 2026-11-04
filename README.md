# Inventory Management Web App

A responsive, frontend-only inventory management application built with React, Vite, and React Router. It uses local dummy data and browser state; there is no backend or database. See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the visual tokens and responsive rules, and [AI_USAGE.md](./AI_USAGE.md) for development notes.

## Live site

[https://eshaaaaaaaa.github.io/inventorymanagement/](https://eshaaaaaaaa.github.io/inventorymanagement/)

The repository’s GitHub Actions workflow builds and publishes the site on every push to `main`. The live URL stays the same while the new build is deployed.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite. For a production build and local preview:

```bash
npm run build
npm run preview
```

To publish to the existing GitHub Pages site:

```bash
npm run deploy
```

## Included experiences

- **Overview:** inventory totals, stock distribution, and items needing attention.
- **Inventory:** searchable and sortable item list with category and stock-status filters.
- **Item details:** item description, stock, location, recent movements, edit, and stock adjustment.
- **Add/edit item:** grouped form, required fields, inline validation, duplicate-ID handling, and save feedback.
- **Feedback states:** initial loading skeleton, no-results empty state, recoverable workspace error, field validation errors, and success notification.
- **Responsive layout:** desktop, tablet, and mobile breakpoints; the inventory list uses a horizontally scrollable data region on narrow screens.

## Preview feedback states

The normal first load briefly displays the loading skeleton. To keep it visible for review, append `?demoState=loading` to the URL. To preview the recoverable error, use `?demoState=error`; select **Try again** to return to the app. Remove the query parameter to return to normal behavior.

Search matches item names and IDs. Updates, additions, and stock changes are held in React state and reset when the page is refreshed.
