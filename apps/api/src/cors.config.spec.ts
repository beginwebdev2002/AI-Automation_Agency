import { corsConfig } from './cors.config';

describe('CORS Configuration', () => {
  it('should not allow all origins', () => {
    expect(corsConfig.origin).not.toBe(true);
    expect(corsConfig.origin).not.toBe('*');
  });

  it('should allow whitelisted origins', () => {
    const origins = corsConfig.origin as (string | RegExp)[];
    expect(origins).toContain('http://localhost:4200');
    expect(origins).toContain('https://beginwebdev2002.github.io');

    // Check Regex
    const githubRegex = origins.find(
      (o) => o instanceof RegExp && o.source.includes('github\\.io')
    );
    expect(githubRegex).toBeDefined();
    expect('https://my-subdomain.github.io'.match(githubRegex!)).toBeTruthy();
  });

  it('should allow specific headers', () => {
    expect(corsConfig.allowedHeaders).toContain('x-telegram-init-data');
    expect(corsConfig.allowedHeaders).toContain('Authorization');
  });
});
