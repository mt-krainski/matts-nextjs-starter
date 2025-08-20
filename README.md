# SaaS Starter

A modern Next.js starter for building SaaS applications with authentication, database, and storage.

## Tech Stack

- **Next.js** - React framework with App Router
- **shadcn/ui** - Modern component library
- **Supabase** - Database, authentication, and storage
- **TypeScript** - Type safety

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your Supabase project and add environment variables

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- User authentication (login/signup)
- Account management
- Database setup with profiles table
- Modern UI components
- TypeScript throughout

## TODOs

Phase 1:

- Teams and workspaces for secure, scalable multi-user setups
- Theming & dark mode toggle - Using ShadCN UI for consistent styling

At this point, the starter is ready to be used to build MVP-grade SaaS applications.

Phase 2:

- Admin dashboard
- Stripe payments - Subscriptions (monthly/yearly recurring) + token/credit-based purchases + mechanism to override and grant credits manually
- Feature flagging interface - Enable/disable features per workspace, team, or user
- Analytics integration - Pre-wired for Google Analytics or another provider
- Internationalization (i18n) - Multi-language and region support
- Help desk integration - Embedded support system with a chat widget

At this point, the starter is ready to be used to build production-grade SaaS applications.
