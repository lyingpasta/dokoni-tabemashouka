import { getRateLimitRemaining, rateLimit } from "./rate-limit";

describe("Rate Limiting", () => {
  describe("when rate limit is not reached", () => {
    describe("rateLimit", () => {
      it("should allow requests within the limit", () => {
        const identifier = "test-endpoint-1";
        const limit = 3;

        expect(rateLimit(identifier, limit)).toBe(true);
        expect(rateLimit(identifier, limit)).toBe(true);
        expect(rateLimit(identifier, limit)).toBe(true);
        expect(rateLimit(identifier, limit)).toBe(false);
      });

      it("should handle multiple identifiers independently", () => {
        const identifier1 = "endpoint-1";
        const identifier2 = "endpoint-2";
        const limit = 2;

        expect(rateLimit(identifier1, limit)).toBe(true);
        expect(rateLimit(identifier1, limit)).toBe(true);
        expect(rateLimit(identifier1, limit)).toBe(false);

        expect(rateLimit(identifier2, limit)).toBe(true);
        expect(rateLimit(identifier2, limit)).toBe(true);
        expect(rateLimit(identifier2, limit)).toBe(false);
      });
    });

    describe("getRateLimitRemaining", () => {
      it("should return correct remaining requests", () => {
        const identifier = "test-endpoint-2";
        const limit = 3;

        expect(getRateLimitRemaining(identifier, limit)).toBe(3);

        rateLimit(identifier, limit);
        expect(getRateLimitRemaining(identifier, limit)).toBe(2);

        rateLimit(identifier, limit);
        expect(getRateLimitRemaining(identifier, limit)).toBe(1);

        rateLimit(identifier, limit);
        expect(getRateLimitRemaining(identifier, limit)).toBe(0);
      });

      it("should handle default limit", () => {
        const identifier = "test-endpoint-3";

        expect(getRateLimitRemaining(identifier)).toBe(50);

        rateLimit(identifier);
        expect(getRateLimitRemaining(identifier)).toBe(49);
      });
    });
  });
});
