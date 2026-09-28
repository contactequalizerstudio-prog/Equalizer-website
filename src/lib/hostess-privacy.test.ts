import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  hasLegacyPrivateFields,
  openField,
  openHostessRecord,
  sealField,
  sealHostessRecord,
  stripPrivateHostessFields,
} from "./hostess-privacy.ts";

const ORIGINAL_SECRET = process.env.ADMIN_SECRET;

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = ORIGINAL_SECRET;
});

describe("hostess private fields", { concurrency: false }, () => {
  it("round-trips a phone number without storing it in plaintext", () => {
    process.env.ADMIN_SECRET = "test-secret";
    const phone = "034 00 000 01";
    const sealed = sealField(phone);

    assert.notEqual(sealed, phone);
    assert.equal(sealed.startsWith("enc:v1:"), true);
    assert.equal(sealed.includes("034"), false);
    assert.equal(openField(sealed), phone);
  });

  it("leaves empty values empty without a secret", () => {
    delete process.env.ADMIN_SECRET;
    assert.equal(sealField(""), "");
    assert.equal(sealField(undefined), "");
  });

  it("refuses to persist a private value when ADMIN_SECRET is missing", () => {
    delete process.env.ADMIN_SECRET;
    assert.throws(() => sealField("034 00 000 01"), /ADMIN_SECRET/);
  });

  it("returns an empty string when the secret cannot decrypt a sealed value", () => {
    process.env.ADMIN_SECRET = "first-secret";
    const sealed = sealField("Lot II A 12");
    process.env.ADMIN_SECRET = "other-secret";
    assert.equal(openField(sealed), "");
  });

  it("detects legacy plaintext and encrypts it on the stored record", () => {
    process.env.ADMIN_SECRET = "test-secret";
    const legacy = {
      id: 2,
      name: "Anifa",
      phone: "034 00 000 01",
      address: "Lot II A 12",
      comment: "Ne pas appeler le dimanche",
    };
    assert.equal(hasLegacyPrivateFields(legacy), true);

    const stored = sealHostessRecord(legacy);
    assert.equal(hasLegacyPrivateFields(stored), false);
    assert.equal(stored.phone?.includes("034"), false);
    assert.deepEqual(openHostessRecord(stored), legacy);
  });

  it("strips admin-only fields before a public render", () => {
    const publicItem = stripPrivateHostessFields({
      id: 2,
      name: "Anifa",
      src: "/hotesse/anifa.png",
      height: "1m50",
      phone: "034 00 000 01",
      address: "Lot II A 12",
      comment: "Interne",
    });

    assert.deepEqual(publicItem, {
      id: 2,
      name: "Anifa",
      src: "/hotesse/anifa.png",
      height: "1m50",
    });
    assert.equal("phone" in publicItem, false);
    assert.equal("address" in publicItem, false);
    assert.equal("comment" in publicItem, false);
  });
});
