# Recipe Finder

A React single-page application for browsing, searching, and adding recipes.

Built for the KBTU React course (Fall 2026) — started as a midterm project,
extended with React Router, nested routes, dynamic URLs and lazy loading.

**Live demo:** https://birzhaaan.github.io/React26/Midterm/

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/recipes` | Recipe list |
| `/recipes/:id` | Recipe details |
| `/dashboard` | Statistics |
| `/login` | Login placeholder |
| `*` | Not found |

## Features

- 105 built-in recipes across 5 categories and 22 cuisines
- Search by title, cuisine or ingredient
- Three filters: category, cuisine, maximum cooking time
- Six sorting options
- Pagination, 12 recipes per page
- All list state lives in the URL via `useSearchParams`, so filtered views
  can be shared, bookmarked and survive a refresh
- Detail view fetched by ID with eight fields per recipe
- Dashboard with five statistics, three breakdowns and a category filter
  that recalculates everything
- Add new recipes through a controlled form, persisted to local storage
- Loading, error, empty and not-found states everywhere
- Five pages loaded lazily through `React.lazy` and `Suspense`
- Responsive layout

## Tech Stack

- React 19 + Vite
- React Router 8
- Simulated async API: promises, randomised delays, local storage
- Hand-written CSS, no UI libraries

## Project Structure

```
src/
├── assets/            # images
├── components/        # NavBar, RecipeCard, FilterBar, Pagination, ...
├── data/
│   └── recipes.json   # 105 initial recipes
├── hooks/
│   └── useFetch.js    # async state + stale-response guard
├── layouts/
│   └── RootLayout.jsx # NavBar + Outlet + footer
├── pages/             # one file per route
├── services/
│   └── service.js     # all API calls
├── styles/
├── App.jsx            # routing only
└── main.jsx
```

## Running Locally

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run deploy
```

Builds the project and publishes `dist` to the `gh-pages` branch under the
`Midterm` folder. The app uses `HashRouter` so that direct links and page
refreshes work on GitHub Pages static hosting.