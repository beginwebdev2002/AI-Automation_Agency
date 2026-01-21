# AAA Agency Coding Standards

## 1. General TypeScript Standards

- Follow official TypeScript Handbook and Best Practices.
- Strict typing is mandatory. Avoid 'any' at all costs.
- Use Interfaces for data structures and Classes for logic.

## 2. Frontend: Angular (apps/admin-dashboard)

- Follow the official Angular Style Guide (https://angular.dev/style-guide).
- Use Standalone Components (Angular 17+ architecture).
- Implement OnPush change detection strategy where possible.
- Shared logic must be in Services, UI only in Components.

## 3. Backend: NestJS (apps/api)

- Follow the official NestJS Style Guide (https://docs.nestjs.com/).
- Strict adherence to NestJS Dependency Injection pattern.
- Every endpoint must have DTOs (Data Transfer Objects) for validation.
- Business logic must reside in @Injectable() Services.
- Use TypeORM or Mongoose best practices for MongoDB interactions.

## 4. Database: MongoDB

- Use Schema validation.
- Indexes must be defined for frequently searched fields (e.g., telegramId, clinicId).
- Follow a non-relational modeling approach but ensure data integrity.
