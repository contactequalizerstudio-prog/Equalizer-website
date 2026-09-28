function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/** Login and logout stay public. Every other admin page and admin API requires a session. */
export function adminRouteNeedsAuth(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (path === "/admin/login" || path === "/api/admin/login" || path === "/api/admin/logout") {
    return false;
  }
  return path.startsWith("/admin") || path.startsWith("/api/admin");
}

export function isAdminApiPath(pathname: string): boolean {
  return normalizePath(pathname).startsWith("/api/admin");
}
