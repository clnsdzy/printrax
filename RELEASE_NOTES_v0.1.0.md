# Printrax v0.1.0 — Release Notes

**Release date:** 16 May 2026  
**Tag:** `v0.1.0`

Printrax is a lightweight print job manager built for cybercafés and small print shops. Version 0.1.0 is the first public release: track orders, monitor production, and see revenue in Nigerian Naira (₦) — all from a single dashboard.

---

## Highlights

- Create and manage print jobs with per-unit pricing and quantity tracking
- Update production in **print batches** as work completes
- Filter jobs by status (Not Started, Ongoing, Completed) with live counts
- Export job details to **PDF** for records or customer handoff
- **Sign up / log in** with email and password (Supabase Auth)
- **Light and dark** themes with a polished, mobile-friendly UI

---

## Features

### Print job management

| Feature | Description |
|---------|-------------|
| **Create jobs** | Add jobs with name, description, rate per unit (₦), and quantity ordered |
| **Edit jobs** | Update job details from the dashboard or job detail page |
| **Track progress** | Log new print batches; quantity printed accumulates until the order is complete |
| **Job statuses** | Automatic status: Not Started → In Progress → Completed |
| **Delete jobs** | Confirmation modal before permanent removal |
| **Job detail view** | Dedicated page per job with progress bar, amounts, and quick actions |

### Dashboard

| Feature | Description |
|---------|-------------|
| **Stats overview** | Cards for total jobs, in progress, completed, and total revenue (₦) |
| **Status tabs** | Filter the job list; tab labels show live counts per status |
| **Responsive grid** | Job cards adapt from mobile to desktop layouts |
| **Toast feedback** | Success and error notifications for all job actions |

### Account and auth

| Feature | Description |
|---------|-------------|
| **Sign up / login** | Email and password authentication via Supabase |
| **Remember me** | Optional extended session preference on login |
| **Profile page** | View email, display name, member ID, and account creation date |
| **Edit display name** | Update your name stored in user metadata |
| **Protected routes** | Dashboard and profile require a signed-in session |

### Export and branding

| Feature | Description |
|---------|-------------|
| **PDF export** | Download a formatted summary of any job from the detail page |
| **PWA manifest** | Web app manifest and favicons for home-screen install |
| **Landing page** | Public homepage explaining the product with sign-up CTAs |

---

## Tech stack

Printrax v0.1.0 is a full-stack TypeScript web application deployed on Vercel with Supabase as the backend.

### Frontend

| Technology | Version | Role |
|------------|---------|------|
| [Next.js](https://nextjs.org/) | 16.x | App Router, React Server Components, API routes, Turbopack dev server |
| [React](https://react.dev/) | 19.x | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe application code |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | 4.x | Accessible UI components (Button, Card, Dialog, Tabs, Table, etc.) |
| [Radix UI](https://www.radix-ui.com/) | — | Headless primitives for dialogs, dropdowns, labels, progress |
| [Hugeicons](https://hugeicons.com/) | 1.x | Icon set (`@hugeicons/react`, `@hugeicons/core-free-icons`) |
| [Sonner](https://sonner.emilkowal.ski/) | 2.x | Toast notifications |
| [jsPDF](https://github.com/parallax/jsPDF) | 4.x | Client-side PDF generation |

### Backend and data

| Technology | Version | Role |
|------------|---------|------|
| [Supabase](https://supabase.com/) | — | Hosted Postgres database, Row Level Security, REST/data access |
| [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) | 2.x | Database and auth client |
| [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) | 0.5.x | Cookie-based auth for Next.js (browser, server, middleware proxy) |
| **Next.js API Routes** | — | `/api/jobs` CRUD for print jobs scoped to the authenticated user |

### Tooling and deployment

| Technology | Role |
|------------|------|
| [pnpm](https://pnpm.io/) | Package manager |
| [Vercel](https://vercel.com/) | Hosting and CI (preview and production deployments) |
| [PostCSS](https://postcss.org/) | CSS processing for Tailwind v4 |

### Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

See [`.env.example`](.env.example) in the repository root.

---

## Getting started

```bash
# Install dependencies
pnpm install

# Copy environment template and add your Supabase credentials
cp .env.example .env.local

# Run the development server (Turbopack)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start managing print jobs from `/dashboard`.

---

## Known limitations (v0.1.0)

- Single-tenant per user account (no shop/team roles yet)
- PDF styling uses default jsPDF fonts (Helvetica)
- Currency is fixed to Nigerian Naira (₦)
- Auth is email/password only (no OAuth providers in this release)

---

## What's next

Future releases may add multi-user shops, additional currencies, richer reporting, and OAuth sign-in. Track progress in [CHANGELOG.md](CHANGELOG.md).

---

**Full change history:** [CHANGELOG.md](CHANGELOG.md)  
**Repository:** [github.com/clnsdzy/printrax](https://github.com/clnsdzy/printrax)
