import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import ConnectionStatus from "../components/ConnectionStatus";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function RootLayout() {
  const online = useOnlineStatus();

  return (
    <div className="app">
      <ConnectionStatus />
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
        <p className={online ? "net-chip online" : "net-chip offline"}>
          <span className="net-dot" />
          {online ? "Online" : "Offline"}
        </p>
      </footer>
    </div>
  );
}