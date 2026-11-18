import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adminRouteNeedsAuth, isAdminApiPath } from "./admin-route-guard.ts";

describe("admin route guard", () => {
  it("requires a session for admin APIs that are not under /admin", () => {
    assert.equal(adminRouteNeedsAuth("/api/admin/hostess"), true);
    assert.equal(adminRouteNeedsAuth("/api/admin/hostess/2"), true);
    assert.equal(adminRouteNeedsAuth("/api/admin/album"), true);
    assert.equal(adminRouteNeedsAuth("/api/admin/upload"), true);
    assert.equal(isAdminApiPath("/api/admin/hostess"), true);
  });

  it("keeps login and logout public", () => {
    assert.equal(adminRouteNeedsAuth("/admin/login"), false);
    assert.equal(adminRouteNeedsAuth("/admin/login/"), false);
    assert.equal(adminRouteNeedsAuth("/api/admin/login"), false);
    assert.equal(adminRouteNeedsAuth("/api/admin/logout"), false);
  });

  it("still protects admin pages and ignores the public site", () => {
    assert.equal(adminRouteNeedsAuth("/admin/hotesses"), true);
    assert.equal(adminRouteNeedsAuth("/reserver-hotesses"), false);
    assert.equal(adminRouteNeedsAuth("/api/booking"), false);
    assert.equal(isAdminApiPath("/admin/hotesses"), false);
  });
});
