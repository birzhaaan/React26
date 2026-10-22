# Recipe Finder

A React single-page application for browsing, searching, and adding recipes.

Built as a midterm project for the KBTU React course (Fall 2026).

## Features

- Browse 105 recipes across 5 categories (breakfast, lunch, dinner, dessert, snack)
- Search by title, cuisine, or ingredient
- Filter by category
- Sort by title, cooking time, or servings
- Paginated list view with 12 items per page
- Detail view for each recipe with ingredients and instructions
- Add new recipes via a controlled form (saved to localStorage)
- Loading, error, empty, and success states
- Responsive design

## Tech Stack

- React 19 (Vite)
- Simulated async API with Promises, delays, and localStorage
- CSS (no external UI libraries)

## Project Structure

```
src/
├── api/
│   └── recipesApi.js        # Simulated async API
├── components/
│   ├── SearchBar.jsx         # Search input
│   ├── FilterBar.jsx         # Category and sort selects
│   ├── RecipeCard.jsx        # Recipe card in list
│   ├── RecipeList.jsx        # Grid of recipe cards
│   ├── RecipeDetail.jsx      # Full recipe view
│   ├── RecipeForm.jsx        # Add new recipe form
│   ├── Pagination.jsx        # Page navigation
│   └── StatusMessage.jsx     # Loading/error/empty states
├── data/
│   └── recipes.json          # 105 initial recipes
├── App.jsx
├── App.css
└── main.jsx
```

## Running Locally

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel: [link]