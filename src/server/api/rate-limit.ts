import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60,
});

const getCurrent = (identifier: string) =>
  (cache.get(identifier) as number) || 0;

export function rateLimit(identifier: string, limit: number = 50): boolean {
  const current: number = getCurrent(identifier);

  if (current >= limit) {
    return false;
  }

  cache.set(identifier, current + 1);
  return true;
}

export function getRateLimitRemaining(
  identifier: string,
  limit: number = 50,
): number {
  const current = getCurrent(identifier);
  return Math.max(0, limit - current);
}
