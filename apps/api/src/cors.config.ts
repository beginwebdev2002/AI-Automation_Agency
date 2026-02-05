import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: ['http://localhost:4200', /\.github\.io$/],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'x-telegram-init-data',
  ],
  credentials: true,
  maxAge: 3600,
};
