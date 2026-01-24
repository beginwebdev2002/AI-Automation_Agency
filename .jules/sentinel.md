Sentinel Journal initialized.

## 2026-01-18 - Hardcoded JWT Secret

**Vulnerability:** Hardcoded 'SECRET_KEY' string in AuthModule and JwtStrategy.
**Learning:** Even with 'Use env var' comments, developers sometimes leave default secrets. NestJS ConfigService must be used consistently.
**Prevention:** Automated scanning for high-entropy strings or common secrets. Enforce ConfigService usage in code reviews.

## 2026-01-18 - Missing Input Validation in Auth

**Vulnerability:** AuthController accepted `any` type for login/register bodies, bypassing validation.
**Learning:** Mongoose validation is late-bound. Controllers must use DTOs with class-validator.
**Prevention:** Enforce DTO usage in controller methods via lint rules or code review. Enable global ValidationPipe.

## 2026-02-19 - Hardcoded Telegram Admin ID

**Vulnerability:** Hardcoded Telegram User ID in `TelegramAuthGuard` granting admin privileges.
**Learning:** Hardcoded IDs for authorization are fragile and insecure. They bypass configuration management and are "security by obscurity".
**Prevention:** Use environment variables or database-driven role management for all user roles.

## 2026-02-21 - Telegram InitData Replay Attack

**Vulnerability:** `TelegramAuthGuard` verified the hash signature of `initData` but did not check `auth_date`.
**Learning:** Signature verification proves _authenticity_ but not _freshness_. Without an expiration check, a captured valid token is valid forever (or until the bot token changes).
**Prevention:** Always validate `auth_date` for Telegram authentication data against a reasonable window (e.g., 24 hours).

## 2026-02-21 - Disabled Security Guard on Sensitive Endpoint

**Vulnerability:** The `TelegramAuthGuard` was commented out on the `ChatController.sendMessage` endpoint, leaving the AI service and database open to unauthenticated access and potential DoS.
**Learning:** Security controls can be accidentally disabled during development and forgotten. Commented-out security code is a major risk indicator.
**Prevention:** Use environment-based bypasses for development instead of modifying code. Scan for commented-out decorators in sensitive files.
