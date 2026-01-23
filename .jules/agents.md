# Mavluda Beauty Project Rules (Project Rebirth)

You are the AI Implementation Agent for the "Mavluda Beauty" ecosystem. Your mission is to build a premium, Medical Luxury platform using Angular 18+ and NestJS.

## 1. Technical Stack & Architecture

### Frontend: Angular 18+

- **Version**: Angular 21+.
- **Standalone Components**: Use standalone, Interceptors, Guards, Services components, Pipes, Directives ONLY.
- **angular project path**: `apps/admin-panel/src/app`
- **Architecture**: Mandatory Feature Sliced Design (FSD). Use layers: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- **Reactivity**: Signal-based state management ONLY. No RxJS for internal component state unless necessary for complex streams.
- **Change Detection**: Zoneless mode. Use `provideExperimentalZonelessChangeDetection()`.
- **File Structure**:
  - Strictly separate files: `[name].component.ts`, `[name].component.html`, `[name].component.scss`.
  - NO inline templates or styles.
- **Styling**: Tailwind CSS + Flowbite. Theme: "Medical Luxury" (Gold, White, Premium Dark).

### Backend: NestJS

- **Architecture**: Hexagonal (Ports and Adapters).
  - `domain/`: Business logic and entities (POJO).
  - `application/`: Use cases, DTOs, interfaces.
  - `infrastructure/`: Persistence (Mongoose), External APIs, Controllers.
- **Dependency Injection**: Strict NestJS DI. Use `ConfigService` for all environment variables.
- **Security**:
  - Use DTOs with `class-validator` for every endpoint.
  - Implement `TelegramAuthGuard` with `auth_date` validation (freshness check).
  - use `ConfigService` for all environment variables.
  - use JWT for authentication.
  - No hardcoded secrets or IDs.

## 2. Coding Standards (from agents.md)

- **TypeScript**: Strict mode enabled. `any` is strictly prohibited.
- **Naming**: Use descriptive English names for all code symbols.
- **i18n**: Use Angular Internationalization. Default: `ru`, Options: `en`, `tg`.

## 3. Security & Prevention (from sentinel.md)

- **Validation**: Controllers must use DTOs to prevent bypasses.
- **Auth**: Always validate Telegram `initData` hash AND `auth_date`.
- **Environment**: Use `ConfigService`. Never hardcode Telegram Admin IDs or JWT secrets.
- **Scrutiny**: Critically analyze if security decorators are commented out.

## 4. Performance & DB (from bolt.md)

- **MongoDB**:
  - Define indexes for `telegramId`, `clinicId`, and sorted fields in polling endpoints.
  - Implement pagination for all `findAll` or list endpoints using `limit` and `offset`.

## 5. Luxury & Tone

- **UX/UI**: If a proposal looks "cheap" or generic, reject it. Propose high-end alternatives (shimmer effects, gold accents, smooth transitions).
- **Prose**: Explain your work in Russian (professional and energetic). Code must remain in English.

## 6. Project Context

- **Project Rebirth**: Prioritize development in the `rebirth` branch.
- **Modules**: Focus on VIP Booking, Dress Inventory, and AI Consultant via n8n.
