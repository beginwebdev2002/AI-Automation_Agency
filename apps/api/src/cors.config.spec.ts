import { corsConfig } from './cors.config';

describe('CORS Configuration', () => {
  it('should be defined', () => {
    expect(corsConfig).toBeDefined();
  });

  it('should allow credentials', () => {
    expect(corsConfig.credentials).toBe(true);
  });

  it('should allow specific headers including x-telegram-init-data', () => {
    expect(corsConfig.allowedHeaders).toContain('x-telegram-init-data');
    expect(corsConfig.allowedHeaders).toContain('Authorization');
  });

  it('should allow localhost:4200', () => {
    const origins = corsConfig.origin as (string | RegExp)[];
    expect(origins).toContain('http://localhost:4200');
  });

  it('should allow github.io subdomains via RegExp', () => {
    const origins = corsConfig.origin as (string | RegExp)[];
    const githubRegex = origins.find((o) => o instanceof RegExp) as RegExp;

    expect(githubRegex).toBeDefined();
    expect(githubRegex.test('https://username.github.io')).toBe(true);
    expect(githubRegex.test('https://my-app.github.io')).toBe(true);
  });

  it('should not allow malicious domains', () => {
    const origins = corsConfig.origin as (string | RegExp)[];
    const githubRegex = origins.find((o) => o instanceof RegExp) as RegExp;

    // The regex matches strictly ending with .github.io due to $ anchor
    expect(githubRegex.test('http://evil.com')).toBe(false);

    // Note: The regex /\.github\.io$/ matches any string ending in .github.io
    // It implies 'evil-github.io' would match if not anchored with start ^ or carefully constructed.
    // My regex was `/\.github\.io$/`.
    // Let's test what it currently permits.
    expect(githubRegex.test('https://evil.github.io')).toBe(true); // This is expected for github pages
    expect(githubRegex.test('https://evil.com/github.io')).toBe(false); // Should be false because of . (dot) escaping in regex
  });
});
