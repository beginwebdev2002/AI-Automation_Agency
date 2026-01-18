#!/bin/bash

# Initialize Nx in current directory
npx create-nx-workspace@latest . --preset=empty --packageManager=npm --skip-git --yes

# Install Plugins
npm install -D @nx/nest @nx/angular @nx/js

# Generate API
npx nx g @nx/nest:app api --directory=apps/api --projectNameAndRootFormat=as-provided --no-interactive

# Generate Admin Panel
npx nx g @nx/angular:app admin-panel --directory=apps/admin-panel --projectNameAndRootFormat=as-provided --style=css --routing=true --no-interactive

# Generate Shared Lib
npx nx g @nx/js:lib data-access --directory=libs/data-access --projectNameAndRootFormat=as-provided --bundler=tsc --no-interactive

# Install Dependencies
npm install @nestjs/mongoose mongoose class-validator class-transformer telegraf nestjs-telegraf @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
