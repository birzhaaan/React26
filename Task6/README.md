# Recipe Finder

A React single-page application for browsing, searching and adding recipes,
with Firebase authentication and a custom client-side cache.

Built for the KBTU React course (Fall 2026).

**Live demo:** https://birzhaaan.github.io/React26/Midterm/

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/about` | About | public |
| `/recipes` | Recipe list | public |
| `/recipes/:id` | Recipe details | public |
| `/dashboard` | Statistics | public |
| `/login` | Sign in | public |
| `/signup` | Create account | public |
| `/profile` | User profile | **protected** |
| `*` | Not found | public |

## Features

### Browsing
- 105 built-in recipes across 5 categories and 22 cuisines
- Search by title, cuisine or ingredient
- Three filters: category, cuisine, maximum cooking time
- Six sorting options and pagination
- All list state lives in the URL via `useSearchParams`, so filtered views
  can be shared, bookmarked and survive a refresh
- Detail view with servings scaling, an ingredient checklist and related recipes
- Dashboard with five statistics, three breakdowns and a category filter
- Add new recipes through a controlled form, persisted to local storage

### Authentication
- Email/password sign-up and sign-in
- Google sign-in via popup
- Sessions persist across refreshes (`browserLocalPersistence`)
- Protected route that redirects unauthenticated visitors to `/login`
  and returns them to the page they wanted after signing in
- Navigation adapts to the authentication state

### Technical
- Five pages loaded lazily through `React.lazy` and `Suspense`
- Loading, error and empty states everywhere
- Stale responses are discarded, so fast navigation never shows the wrong data
- Responsive layout

## Caching Strategy

API responses are cached in memory by `src/services/cache.js`. The UI never
talks to the cache directly — it calls the service layer, which decides whether
to serve a cached value or make a request.

### Query keys

Each entry is stored under a key built from the resource name and its
parameters:

```
recipes?category=dinner&page=2&perPage=12
recipe?id=47
stats?category=dessert
filterOptions
```

`buildKey()` sorts parameter names and drops empty values, so the same filter
combination always produces the same key regardless of argument order.

### Expiration

Every entry carries an `expiresAt` timestamp. A read past that point deletes
the entry and returns `null`, which triggers a fresh request.

| Resource | TTL | Reason |
|---|---|---|
| `recipes` (list) | 5 min | changes when a recipe is added |
| `recipe` (detail) | 10 min | individual recipes rarely change |
| `filterOptions` | 30 min | category and cuisine lists are near-static |
| `stats` | 5 min | derived from the recipe collection |

### Request de-duplication

In-flight promises are tracked in a separate map. If two components request
the same key at the same time, only one request is made and both receive the
same promise. This also absorbs the double effect invocation that React
performs in `StrictMode` during development.

### Invalidation

`invalidateRecipeCaches()` runs after `createRecipe()` and clears four
resources by prefix, because a new recipe affects all of them:

- `recipes` — every cached filter combination
- `recipe` — individual recipe entries
- `filterOptions` — a new cuisine may have been introduced
- `stats` — counts and averages shift

Failed requests are never cached: the entry is written only after the promise
resolves successfully.

### Seeing it work

The recipe list shows a small `from cache` badge when the data was served from
memory rather than fetched. Navigate away from `/recipes` and back — the list
appears instantly with the badge. Add a recipe and the badge disappears,
because the cache was invalidated.

## Tech Stack

- React 19 + Vite
- React Router 8 (`HashRouter`)
- Firebase Authentication
- Custom in-memory cache
- Hand-written CSS, no UI libraries

## Project Structure

```
src/
├── assets/                 # images
├── components/             # NavBar, RecipeCard, FilterBar, ProtectedRoute, ...
├── context/
│   └── AuthContext.jsx     # auth state provider
├── data/
│   └── recipes.json        # 105 initial recipes
├── hooks/
│   ├── useAuth.js          # consumes AuthContext
│   └── useFetch.js         # async state + stale-response guard
├── layouts/
│   └── RootLayout.jsx      # NavBar + Outlet + footer
├── pages/                  # one file per route
├── services/
│   ├── authService.js      # Firebase auth wrapper
│   ├── cache.js            # keys, TTL, invalidation
│   ├── firebase.js         # SDK initialisation
│   └── service.js          # recipe API
├── styles/
├── App.jsx                 # routing only
└── main.jsx
```

UI components never touch `localStorage` or the Firebase SDK directly; both
are reached through the service layer.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase project values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | same |
| `VITE_FIREBASE_PROJECT_ID` | same |
| `VITE_FIREBASE_STORAGE_BUCKET` | same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same |
| `VITE_FIREBASE_APP_ID` | same |

Vite only exposes variables prefixed with `VITE_` to client code. Restart the
dev server after editing `.env.local`.

Enable **Email/Password** and **Google** under Authentication → Sign-in method,
and add your deployment domain under Authentication → Settings →
Authorized domains.

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
refreshes work on static hosting.