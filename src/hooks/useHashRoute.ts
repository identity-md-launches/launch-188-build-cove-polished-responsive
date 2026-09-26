import { useEffect, useState } from "react";

export type Route = "dashboard" | "markets" | "about";

export const ROUTES: { id: Route; hash: string; label: string }[] = [
  { id: "dashboard", hash: "#/", label: "Dashboard" },
  { id: "markets", hash: "#/markets", label: "Markets" },
  { id: "about", hash: "#/about", label: "About this demo" },
];

function parse(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (path === "markets") return "markets";
  if (path === "about") return "about";
  return "dashboard";
}

/**
 * Hash routing so the static export works from any subpath with no server
 * rewrites. Unknown hashes fall back to the dashboard.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
