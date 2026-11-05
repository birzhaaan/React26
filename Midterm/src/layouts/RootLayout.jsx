import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

export default function RootLayout() {
  return (
    <div className="app">
      <NavBar />
      <main className="app-main">
        <Suspense
          fallback={<div className="status-message loading">Loading page...</div>}
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="app-footer">
        <p>Recipe Finder — KBTU React course, Fall 2026</p>
      </footer>
    </div>
  );
}