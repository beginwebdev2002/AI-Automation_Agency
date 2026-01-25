import { corsConfig } from './cors.config';

describe('CORS Configuration', () => {
  it('should have a secure origin configuration', () => {
    // Should be an array, not a boolean or wildcard string
    expect(Array.isArray(corsConfig.origin)).toBe(true);
    expect(corsConfig.origin).not.toBe(true);
    expect(corsConfig.origin).not.toBe('*');
  });

  it('should include allowed domains', () => {
    const origins = corsConfig.origin as (string | RegExp)[];
    expect(origins).toContain('https://beginwebdev2002.github.io');
    expect(origins).toContain('http://localhost:4200');
    // Check for the RegExp
    const regex = origins.find((o) => o instanceof RegExp);
    expect(regex).toBeDefined();
    expect((regex as RegExp).test('https://foo.github.io')).toBe(true);
  });

  it('should restrict allowed headers', () => {
    expect(corsConfig.allowedHeaders).not.toBe('*');
    expect(corsConfig.allowedHeaders).toContain('Authorization');
    expect(corsConfig.allowedHeaders).toContain('x-telegram-init-data');
  });

  it('should allow credentials', () => {
    expect(corsConfig.credentials).toBe(true);
  });
});
