# Recipe Finder — PWA with Redux Toolkit

An installable, offline-capable React application for browsing, searching and
saving recipes, with Firebase authentication and Redux Toolkit state management.

Built for the KBTU React course (Fall 2026).

**Live demo:** https://birzhaaan.github.io/React26/Task8/

## Features

### Browsing
- 105 recipes across 5 categories and 22 cuisines, served as a public JSON API
- Debounced search by title, cuisine or ingredient
- Three filters: category, cuisine, maximum cooking time
- Six sorting options and pagination
- All list state lives in the URL, so filtered views can be shared and survive
  a refresh
- Recipe details with servings scaling, an ingredient checklist and related
  recipes
- Dashboard with five statistics, three breakdowns and a category filter
- Add new recipes through a controlled form

### Authentication
- Email/password sign-up and sign-in, plus Google sign-in
- Sessions persist across refreshes
- Protected `/profile` route with redirect back to the requested page
- Navigation adapts to the authentication state

### Progressive Web App
- Installable on desktop and mobile
- Works offline after the first visit
- Hand-written service worker, no Workbox
- Update prompt when a new version is deployed
- Offline page, connectivity indicator and graceful failure handling
- Responsive from 320px upwards with a collapsible navigation menu

## State Management (Redux Toolkit)

Server state lives in Redux; everything temporary stays local.

### Store

`src/store/store.js` configures the store with four feature reducers. The
`<Provider>` wraps the whole app in `src/main.jsx`, outside the router, so the
store is available to every route and to the authentication context.

### Slices

Slices are organised by feature under `src/features/`:

| Slice | File | Holds |
|---|---|---|
| `recipes` | `features/recipes/recipesSlice.js` | list, pagination, create status |
| `recipeDetail` | `features/recipeDetail/recipeDetailSlice.js` | one recipe and its related recipes |
| `dashboard` | `features/dashboard/dashboardSlice.js` | statistics for the selected category |
| `filterOptions` | `features/filterOptions/filterOptionsSlice.js` | category and cuisine lists |

### What is deliberately NOT in Redux

- **Authentication** stays in `AuthContext`. Firebase already owns that state
  and pushes updates through `onAuthStateChanged`; mirroring it into Redux
  would duplicate a single source of truth.
- **Filters, sorting and pagination** stay in the URL via `useSearchParams`.
  The URL is what makes views shareable and refresh-proof, so copying it into
  the store would create two sources of truth.
- **Form fields, the search input, the open/closed state of the form, servings
  and the ingredient checklist** stay in component state. They are transient UI
  state and nothing outside the component reads them.

### Thunks

Five `createAsyncThunk` operations, all handled through `extraReducers`:

| Thunk | Type | Purpose |
|---|---|---|
| `fetchRecipesList` | list | fetches a filtered, sorted, paginated page |
| `fetchRecipeDetail` | details | fetches one recipe plus related recipes |
| `createRecipeEntry` | mutation | creates a recipe and refreshes affected data |
| `fetchDashboardStats` | list | computes statistics for a category |
| `fetchFilterOptionsList` | list | loads category and cuisine options |

Every thunk resolves through `rejectWithValue`, so the slice stores a readable
message rather than a serialised error object.

**Stale requests.** Each slice stores `currentRequestId` on `pending` and
compares it on `fulfilled` and `rejected`. A response whose id no longer
matches is discarded, so a slow earlier request can never overwrite a newer one
when filters change quickly.

**Unnecessary requests.** `fetchFilterOptionsList` declares a `condition` that
skips dispatch when the options are already loaded or a request is in flight,
so mounting `FilterBar` repeatedly costs nothing.

**Refreshing after a mutation.** `createRecipeEntry` re-dispatches
`fetchRecipesList` with the query stored in `lastQuery`. The dashboard and
filter-options slices additionally react to `createRecipeEntry.fulfilled` in
their own `extraReducers` and reset themselves to `idle`, because a new recipe
changes both the statistics and the list of cuisines.

**Loading, errors, empty results and retries.** Every slice exposes a `status`
of `idle | loading | succeeded | failed`. The recipes list and the dashboard
render a *Try again* button on `failed` that re-dispatches the same thunk; an
empty result is distinguished from an error by checking `status === "succeeded"`
together with an empty array.

### Selectors

`src/store/selectors.js` holds the shared selectors; simple field readers live
next to their slice.

| Selector | Memoized | Derives |
|---|---|---|
| `selectRecipeListView` | yes | adds `difficulty` and `ingredientCount` to every recipe |
| `selectFilterOptionsView` | yes | turns raw strings into `{value, label}` pairs |
| `selectDashboardHighlights` | yes | percentage share per category and the largest one |
| `selectPagination` | yes | groups page, total pages and total items |
| `selectRecipeItems`, `selectRecipesStatus`, … | no | plain field access |

The memoized ones use `createSelector`. Beyond caching the derived work, this
matters for correctness: a selector that builds a new object on every call
would make `useSelector` see a changed value on every render.

### Relationship to the service cache

`services/cache.js` from the previous assignment is still in place. The two
layers are not duplicates: the cache works at transport level — it
de-duplicates in-flight requests and holds responses under a query key with a
TTL — while Redux holds the state the UI renders right now. Redux never caches
by query key, and the cache never knows about components.

## PWA Architecture

### Manifest

`public/manifest.webmanifest` declares the app identity, `start_url` and
`scope` scoped to `/React26/Task8/`, `display: standalone`, theme and
background colours, and three icons — 192×192, 512×512 and a maskable 512×512
for Android adaptive icons.

### Service worker lifecycle

`public/sw.js` is written by hand and contains three placeholders that
`scripts/generate-sw.js` fills in after the Vite build:

| Placeholder | Replaced with |
|---|---|
| `__SW_VERSION__` | SHA-256 of all built files, shortened to 8 characters |
| `__BASE_URL__` | the `base` value read from `vite.config.js` |
| `__PRECACHE_URLS__` | every built file worth precaching |

Vite gives built JS and CSS hashed file names, so the precache list can only be
known after the build. Deriving the version from file contents means the
service worker byte-changes whenever the app changes, which is what makes the
browser pick the update up.

**install** opens the shell cache and calls `addAll`. The call is atomic: if
any file cannot be fetched — for example because the user went offline during
installation — the whole install fails and the previous service worker keeps
serving the app. A partially filled cache is never activated.

**activate** deletes every `rf-` cache that does not belong to the current
version, purges expired data entries, and calls `clients.claim()`.

**fetch** routes each request to a strategy (below).

### Update mechanism

A new service worker installs in the background and waits. `src/services/pwa.js`
detects this through the `updatefound` and `statechange` events and reports it
to React, which renders a banner with an **Update now** button. The button
posts `{ type: "SKIP_WAITING" }` to the waiting worker; when it takes control
the `controllerchange` event fires and the page reloads once, guarded by a flag
so it cannot loop. The registration is also refreshed every hour and whenever
the tab becomes visible again.

Nothing has to be cleared by hand: old caches are versioned and removed on
activation.

### Caching strategies

| Request | Strategy | Cache | Limit |
|---|---|---|---|
| App shell (`index.html`, `offline.html`, manifest) | precache, network-first on navigation | `rf-shell-<version>` | replaced per version |
| JS, CSS, images, icons, fonts | cache-first | `rf-assets-<version>` | 60 entries |
| `data/*.json` (public API) | network-first | `rf-data-<version>` | 20 entries, 24 h |

Static assets are cache-first because Vite gives them content-hashed names, so
a given URL can never change. Public data is network-first so that a connected
user always sees fresh content and the cache acts purely as an offline
fallback — which also makes the "saved data" indicator accurate.

Growth is bounded twice over: `trimCache` drops the oldest entries past the
limit, and `purgeExpiredData` removes data entries older than 24 hours using an
`X-SW-Cached-At` header written at cache time.

### What is deliberately not cached

Requests to another origin are passed straight through, with web fonts the only
exception. Firebase authentication traffic therefore never reaches a cache, so
no tokens or user data end up in shared storage. Requests carrying a `probe`
query parameter also bypass the service worker — they are used for genuine
connectivity checks.

Failures never reject: a missing asset resolves to a 504 placeholder and a
missing data response to a 503 JSON body, so the application renders its error
state instead of crashing.

### Offline behaviour

- `public/offline.html` is a standalone precached page with its own inline
  styles and a retry button. The service worker serves it when a navigation
  fails and the app shell is unavailable.
- `/offline` inside the app offers a retry that performs a real network probe
  rather than trusting `navigator.onLine`.
- A banner appears while the browser reports no connection, and the footer
  shows a permanent online/offline chip.
- `RouteErrorBoundary` catches lazily loaded pages that cannot be fetched and
  shows a retry screen instead of a blank page.
- When the connection returns, cached data is invalidated and refetched.

## Tech Stack

- React 19 + Vite
- React Router 8 (`HashRouter`)
- Redux Toolkit + React Redux for global state and async operations
- Firebase Authentication
- Hand-written service worker and in-memory request cache
- Hand-written CSS, no UI libraries

## Project Structure

```
public/
├── data/recipes.json      # public API endpoint
├── icons/                 # 192, 512, maskable, apple-touch
├── manifest.webmanifest
├── offline.html           # standalone offline fallback
└── sw.js                  # service worker template
scripts/
└── generate-sw.js         # fills in the precache manifest and version
src/
├── components/            # NavBar, ConnectionStatus, RouteErrorBoundary, ...
├── context/AuthContext.jsx
├── features/              # Redux slices, one folder per feature
│   ├── recipes/
│   ├── recipeDetail/
│   ├── dashboard/
│   └── filterOptions/
├── hooks/                 # useAuth, useOnlineStatus, usePwaUpdate, useDebouncedValue
├── layouts/RootLayout.jsx
├── pages/
├── services/              # service, cache, auth, firebase, pwa
├── store/
│   ├── store.js           # configureStore
│   └── selectors.js       # memoized cross-slice selectors
├── styles/
├── utils/recipe.js        # pure helpers shared by selectors and pages
├── App.jsx                # routing only
└── main.jsx
```

UI components never touch `localStorage`, the Firebase SDK or the API directly;
all three are reached through the service layer, and the data they return is
owned by Redux.

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

## Running

```bash
npm install
npm run dev          # service worker is disabled in development
npm run build        # builds and generates the service worker
npm run preview      # serves the build — use this to test PWA behaviour
npm run deploy       # publishes to GitHub Pages
```

The service worker is only registered in production builds, because the file in
`public/` still contains its placeholders until the build fills them in.

## Testing the PWA

1. `npm run build && npm run preview`
2. Load the page online and wait for the service worker to reach *activated*
3. DevTools → Application → Cache Storage shows `rf-shell`, `rf-assets`,
   `rf-data`
4. Switch DevTools → Network to **Offline** and reload — the app loads, the
   offline banner appears and recipes are still listed
5. Rebuild and reload to see the update banner