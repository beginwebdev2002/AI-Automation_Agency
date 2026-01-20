Sentinel Journal initialized.
## 2026-01-18 - Hardcoded JWT Secret
**Vulnerability:** Hardcoded 'SECRET_KEY' string in AuthModule and JwtStrategy.
**Learning:** Even with 'Use env var' comments, developers sometimes leave default secrets. NestJS ConfigService must be used consistently.
**Prevention:** Automated scanning for high-entropy strings or common secrets. Enforce ConfigService usage in code reviews.

## 2026-01-18 - Missing Input Validation in Auth
**Vulnerability:** AuthController accepted `any` type for login/register bodies, bypassing validation.
**Learning:** Mongoose validation is late-bound. Controllers must use DTOs with class-validator.
**Prevention:** Enforce DTO usage in controller methods via lint rules or code review. Enable global ValidationPipe.
