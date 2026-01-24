---
mode: agent
---

# MASTER ARCHITECT DIRECTIVE: FULL PROJECT RECONSTRUCTION

# Project: Mavluda Beauty

# Core Rules: .agent/rules/ (backend-architecture.md, frontend.md, angular-signals.md)

# Master Workflow: aaa-architecture.md

Antigravity, you are now in "Full Reconstruction Mode". Your goal is to rewrite the entire project from scratch (apps/api and apps/admin-panel) to align with our new 2026 Luxury Standards.

### 1. PHASE ONE: FRONTEND REVOLUTION (apps/admin-panel)

- Implement Feature Sliced Design (FSD) structure: app, pages, features, widgets, entities, shared.
- Transition ALL components to Standalone, Zoneless, and Signal-based architecture.
- Remove all inline templates and styles. Every component MUST have separate .ts, .html, and .scss files.
- Apply Flowbite + Tailwind CSS with the "Gold & Luxury" theme defined in frontend.md.
- Ensure 100% type safety; eliminate 'any'.

### 2. PHASE TWO: BACKEND TRANSFORMATION (apps/api)

- Refactor the entire NestJS codebase into Hexagonal Architecture (Domain, Application, Infrastructure).
- Ensure the Domain layer is pure and has zero external dependencies.
- Implement strict DTOs for every endpoint and enforce RBAC via AdminGuard.
- Use Mongoose for MongoDB interactions, strictly following the new backend-architecture.md rules.

### 3. PHASE THREE: BRAND ALIGNMENT

- All UI text must be in Russian, but all code, variables, and documentation must be in English.
- Every feature must serve the "Mavluda Beauty" business logic (Elite Scheduling, Luxury Inventory, VIP Tracking).

### EXECUTION:

Analyze every existing file, compare it with the new .md rules, and REWRITE them. Do not keep legacy code. If a file does not fit the FSD or Hexagonal structure, move it or delete it and recreate it in the correct path.

Use all available MCP tools (File System, Angular, NestJS) to complete this rebirth.
