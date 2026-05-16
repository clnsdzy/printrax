# Changelog

All notable changes to [Printrax](https://github.com/clnsdzy/printrax) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-16

First public release of Printrax — print job management for cybercafés.

### Added

- **Initial application** ([#1](https://github.com/clnsdzy/printrax/pull/1)) — Next.js App Router app with shadcn/ui design system, Hugeicons, and landing page
- **Supabase backend** ([#2](https://github.com/clnsdzy/printrax/pull/2)) — Supabase clients (browser, server, SSR proxy), Postgres schema for print jobs, REST API routes (`/api/jobs`, `/api/jobs/[id]`)
- **Print job detail page** ([#2](https://github.com/clnsdzy/printrax/pull/2)) — Per-job view with progress, status badges, and actions
- **Nigerian Naira (₦) currency** ([#2](https://github.com/clnsdzy/printrax/pull/2)) — Revenue and pricing displayed in NGN
- **Responsive dashboard UI** ([#3](https://github.com/clnsdzy/printrax/pull/3)) — Jobs table redesigned as a responsive card grid; updated global styles and design preset
- **New Job modal** — Create print jobs with name, description, rate per unit, and quantity ordered
- **Theme support** — Light/dark mode via `next-themes`, theme toggle in navbar and landing page
- **Edit Job modal** ([#4](https://github.com/clnsdzy/printrax/pull/4)) — Edit job name, description, rate, and quantity; `updateJob` API support
- **PWA assets** ([#5](https://github.com/clnsdzy/printrax/pull/5)) — Favicons and `manifest.json` for installable web app metadata
- **Supabase authentication** ([#6](https://github.com/clnsdzy/printrax/pull/6), [#7](https://github.com/clnsdzy/printrax/pull/7)) — Email/password sign-up and login, auth callback route, session proxy, protected `/dashboard` redirect
- **Dashboard stats cards** — Total jobs, in progress, completed, and total revenue at a glance
- **Job status tabs** ([#8](https://github.com/clnsdzy/printrax/pull/8)) — Filter jobs by Not Started, Ongoing, and Completed with dynamic tab counts
- **PDF export** ([#8](https://github.com/clnsdzy/printrax/pull/8)) — Export individual print job details to PDF via jsPDF from the job detail page
- **User profile page** — View account email, display name, member ID, and join date; edit display name modal
- **Remember Me** ([#10](https://github.com/clnsdzy/printrax/pull/10)) — Optional “Remember me” checkbox on login with extended session preference
- **Batch progress tracking** ([#12](https://github.com/clnsdzy/printrax/pull/12)) — Update Progress modal records new print batches (additive quantity) instead of only absolute totals
- **Profile security section** ([#11](https://github.com/clnsdzy/printrax/pull/11)) — Password change and account management UI on profile page
- **Toast notifications** ([#14](https://github.com/clnsdzy/printrax/pull/14)) — Sonner toasts for job create, update, delete, and progress actions
- **Delete confirmation** — Modal to confirm job deletion from dashboard and detail views
- **Landing page** — Marketing homepage with feature highlights and sign-up/login CTAs

### Changed

- **UI overhaul** ([#7](https://github.com/clnsdzy/printrax/pull/7)) — Refreshed layout, typography, and component styling across auth and dashboard flows
- **Authenticated redirects** ([#6](https://github.com/clnsdzy/printrax/pull/6)) — Post-login and post-sign-up navigation targets `/dashboard`
- **Dashboard default tab** ([#9](https://github.com/clnsdzy/printrax/pull/9)) — Default filter set to “Ongoing” jobs
- **Decimal and currency formatting** ([#5](https://github.com/clnsdzy/printrax/pull/5)) — Cleaner number display for rates and revenue
- **Edit job flow** ([#5](https://github.com/clnsdzy/printrax/pull/5)) — Job name and description included when editing existing jobs
- **Job detail page and navbar** ([#13](https://github.com/clnsdzy/printrax/pull/13)) — Improved navigation and detail layout
- **README** — Project description and hero screenshot

### Fixed

- **Hugeicons compatibility** ([#1](https://github.com/clnsdzy/printrax/pull/1)) — Icon import names aligned with `@hugeicons/core-free-icons` package
- **Job creation errors** ([#2](https://github.com/clnsdzy/printrax/pull/2)) — Improved error logging and user-facing handling on failed creates
- **Radix dropdown** — Dependency fix for dropdown menu component
- **pnpm lockfile** — Synced lockfile with `package.json`
- **jsPDF export** ([#8](https://github.com/clnsdzy/printrax/pull/8)) — Helvetica default font; RGB color values passed correctly to jsPDF methods
- **Sign-up redirect** ([#9](https://github.com/clnsdzy/printrax/pull/9)) — Correct redirect after successful registration when session is available
- **Profile hydration mismatch** ([#13](https://github.com/clnsdzy/printrax/pull/13)) — Resolved React hydration error on profile page
- **Navbar user icon** ([#13](https://github.com/clnsdzy/printrax/pull/13)) — Wrapped `UserIcon` with `HugeiconsIcon` for consistent rendering

### Merged pull requests

| PR | Branch | Summary |
|----|--------|---------|
| [#1](https://github.com/clnsdzy/printrax/pull/1) | `printrax-app` | Initial Printrax app with Next.js and design system |
| [#2](https://github.com/clnsdzy/printrax/pull/2) | `v0/clnsdzy-8c49a3bc` | Supabase migration, Naira currency, job detail page |
| [#3](https://github.com/clnsdzy/printrax/pull/3) | `v0/clnsdzy-09a436c8` | Responsive card grid and UI redesign |
| [#4](https://github.com/clnsdzy/printrax/pull/4) | `v0/clnsdzy-1f7ccf84` | Edit Job modal and update API |
| [#5](https://github.com/clnsdzy/printrax/pull/5) | `v0/clnsdzy-398e7550` | Favicons, manifest, currency cleanup |
| [#6](https://github.com/clnsdzy/printrax/pull/6) | `auth-setup` | Supabase auth, login/sign-up pages, auth guards |
| [#7](https://github.com/clnsdzy/printrax/pull/7) | `auth-setup` | UI overhaul for authenticated experience |
| [#8](https://github.com/clnsdzy/printrax/pull/8) | `dashboard-print-jobs` | Status tabs, dynamic counts, PDF export |
| [#9](https://github.com/clnsdzy/printrax/pull/9) | `v0/clnsdzy-c73f0b4c` | Sign-up redirect and dashboard default tab |
| [#10](https://github.com/clnsdzy/printrax/pull/10) | `v0/clnsdzy-24dc1ed2` | Remember Me checkbox and logout timer |
| [#11](https://github.com/clnsdzy/printrax/pull/11) | `v0/clnsdzy-d85e6569` | Profile page with edit name and security |
| [#12](https://github.com/clnsdzy/printrax/pull/12) | `v0/clnsdzy-18331be0` | Batch-based progress updates |
| [#13](https://github.com/clnsdzy/printrax/pull/13) | `v0/clnsdzy-16dc9644` | Job detail/navbar updates, hydration and icon fixes |
| [#14](https://github.com/clnsdzy/printrax/pull/14) | `v0/clnsdzy-aab9182a` | Sonner toast notifications |

---

## Development timeline

| Date | Milestone |
|------|-----------|
| 2026-03-18 | Repository initialized; core Next.js app scaffolded |
| 2026-03-21 | [#1](https://github.com/clnsdzy/printrax/pull/1) merged — first working prototype |
| 2026-05-04 | Supabase backend, UI redesign, modals, and theme support |
| 2026-05-05 | Edit job, favicons, manifest, currency polish |
| 2026-05-06 | Authentication and dashboard UI overhaul ([#6](https://github.com/clnsdzy/printrax/pull/6), [#7](https://github.com/clnsdzy/printrax/pull/7)) |
| 2026-05-15 | Dashboard tabs, PDF export, profile page ([#8](https://github.com/clnsdzy/printrax/pull/8)–[#9](https://github.com/clnsdzy/printrax/pull/9)) |
| 2026-05-16 | Remember Me, batch progress, toasts, bug fixes ([#10](https://github.com/clnsdzy/printrax/pull/10)–[#14](https://github.com/clnsdzy/printrax/pull/14)); **v0.1.0** release |

[0.1.0]: https://github.com/clnsdzy/printrax/releases/tag/v0.1.0
