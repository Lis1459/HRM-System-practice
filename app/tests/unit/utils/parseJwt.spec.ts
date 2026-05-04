import { describe, it, expect } from "vitest";
import { parseJwt } from "~/utils/parseJwt";

const createMockToken = (payload: object) => {
  const base64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${base64}.signature`;
};

describe("parseJwt", () => {
  it("should parse valid JWT token", () => {
    const payload = {
      sub: 1,
      email: "test@example.com",
      exp: 9999999999,
      role: "Admin",
    };

    const token = createMockToken(payload);

    const result = parseJwt(token);

    expect(result).toEqual(payload);
  });

  it("should return null if token has no payload", () => {
    const token = "invalidtoken";

    const result = parseJwt(token);

    expect(result).toBeNull();
  });

  it("should throw error on invalid base64", () => {
    const token = "header.invalid-base64.signature";

    expect(() => parseJwt(token)).toThrow();
  });

  it("should throw error on invalid JSON", () => {
    const badJson = btoa("not-json");
    const token = `header.${badJson}.signature`;

    expect(() => parseJwt(token)).toThrow();
  });

  it("should return null if payload part is empty", () => {
    const token = "header..signature";

    const result = parseJwt(token);

    expect(result).toBeNull();
  });
});
