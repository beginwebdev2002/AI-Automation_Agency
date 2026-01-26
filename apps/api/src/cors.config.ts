import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// Restrict CORS to known frontends (Angular local dev and GitHub Pages prod)
// to prevent unauthorized cross-origin access and mitigate CSRF risks.
export const corsConfig: CorsOptions = {
  origin: [
    'http://localhost:4200',
    'https://beginwebdev2002.github.io',
    /\.github\.io$/,
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization, x-telegram-init-data',
  maxAge: 3600,
};
