# Lumière Dermatology Booking App — Project Reference

## Overview
Luxury cosmetic dermatology appointment booking MVP. Fully client-side, static deployment
on GitHub Pages. No backend, no database — all persistence via localStorage.

## Repository
- Remote: ianzro/bookingapp on GitHub
- Production branch: `main` (GitHub Actions auto-deploys to GitHub Pages on push)
- Development: **always create `milestone/*` branches, PR to `main`, never commit directly to `main`**

## Tech Stack
- Build: Vite (`base: '/bookingapp/'` in vite.config.js — **required** for GitHub Pages)
- UI: React 18 with HashRouter (react-router-dom) — hash routing avoids GitHub Pages 404s
- Styling: Tailwind CSS v3 with custom luxury design tokens
- Icons: Lucide React
- No TypeScript — plain JSX throughout

## Branch Strategy
New `milestone/*` branches must be created for each feature group:
```
milestone/foundation        AIS-63, AIS-15          ← current
milestone/clinic-provider   AIS-6, AIS-8, AIS-9, AIS-10, AIS-25
milestone/booking-flow      AIS-11, AIS-12, AIS-27, AIS-34
milestone/admin-dashboard   AIS-16, AIS-13, AIS-18, AIS-19, AIS-21
milestone/patient-records   AIS-55, AIS-56, AIS-61, AIS-62
```
Each milestone branch is PR'd to `main`. GitHub Pages auto-deploys only when `main` is updated.

## Design System (tailwind.config.js custom tokens)
```
brand-navy:       #0B1829   sidebar, dark surfaces
brand-teal:       #0E6D6D   CTAs, primary actions
brand-teal-light: #14A8A8   hover states
brand-gold:       #C9A84C   luxury accents, badges
brand-cream:      #FAF8F5   page background
brand-slate:      #4A5568   body text
```
Fonts: **Playfair Display** (headings, `font-display`) + **Inter** (body, `font-sans`) via Google Fonts in `index.html`.

## localStorage Keys (all prefixed `derm_`)
| Key | Type | Purpose |
|-----|------|---------|
| `derm_seed_version` | `"1"` | Bump to force re-seed on next load |
| `derm_clinic` | object | Singleton clinic profile |
| `derm_services` | array | Service catalog with `durationMinutes` |
| `derm_providers` | array | Providers with nested availability blocks |
| `derm_patients` | array | Patient records |
| `derm_bookings` | array | All appointments |
| `derm_users` | array | Auth accounts (Web Crypto SHA-256 hashed passwords) |
| `derm_session` | object\|null | Active login session |
| `derm_notifications` | array | In-app notification queue |

## Roles
- **admin** — full access: clinic settings, services, providers, all patient data
- **staff** — operational access only: appointments + patient name/contact; cannot edit clinic/services/providers; cannot view patient DOB or clinical notes

## Booking Status State Machine
```
pending → confirmed → arrived → completed
pending → cancelled  (reason required)
confirmed → cancelled  (reason required)
confirmed → no_show
arrived → completed
```

## Key Files
| File | Purpose |
|------|---------|
| `src/seed/seedData.js` | Static seed data + `seedLocalStorage()` — source of truth for initial state |
| `src/context/DataContext.jsx` | All data mutations; reads/writes localStorage |
| `src/context/AuthContext.jsx` | Session management; SHA-256 login via Web Crypto |
| `src/utils/slotGenerator.js` | Availability + overlap detection for booking slots |
| `src/utils/duplicateDetect.js` | Patient deduplication by phone/email |
| `vite.config.js` | Must keep `base: '/bookingapp/'` for GitHub Pages |

## Seed Accounts (dev only)
```
admin@lumierederm.ph / Admin123!   role: admin
staff@lumierederm.ph / Staff123!   role: staff
```

## Route Structure (HashRouter)
```
/#/login                     → LoginPage (public)
/#/book                      → BookingPage (public)
/#/book/confirmation/:id     → ConfirmationPage (public)
/#/admin/dashboard           → DashboardPage (auth required)
/#/admin/appointments        → AppointmentsPage
/#/admin/clinic              → ClinicProfilePage (admin only)
/#/admin/services            → ServicesPage (admin only)
/#/admin/providers           → ProvidersPage (admin only)
/#/admin/patients            → PatientsPage
```

## Jira Project
- Project: **AI Service** (key: `AIS`)
- Cloud: `wizlex.atlassian.net`
- Sprint 1 tasks tracked in Jira; update ticket status when each milestone is merged to `main`

## GitHub Pages Deployment
- Trigger: push to `main`
- Workflow: `.github/workflows/deploy.yml`
- Publishes `./dist` to `gh-pages` branch via `peaceiris/actions-gh-pages@v4`
- Live URL: `https://ianzro.github.io/bookingapp/`
