import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: [
    'https://beginwebdev2002.github.io',
    'http://localhost:4200',
    /^https:\/\/.*\.github\.io$/,
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization, x-telegram-init-data',
  maxAge: 3600,
};
