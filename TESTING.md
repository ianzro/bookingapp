# Lumière Dermatology Booking App — Sprint 1 Test Guide

## Live URL
**https://ianzro.github.io/bookingapp/**

> The app uses hash routing. All paths start with `/#/`. GitHub Pages serves the same `index.html` for all routes, so deep links work correctly.

---

## What Was Built

Sprint 1 delivers a fully client-side booking MVP for a luxury cosmetic dermatology clinic. No backend, no database — all data lives in `localStorage` under `derm_*` keys.

### Milestones shipped

| # | Branch | Tickets | What it covers |
|---|--------|---------|---------------|
| 1 | `milestone/foundation` | AIS-63, AIS-15 | Project scaffold, Vite + React + Tailwind, seed data, login with SHA-256 auth |
| 2 | `milestone/clinic-provider` | AIS-6, AIS-8, AIS-9, AIS-10, AIS-25 | Admin shell, sidebar, clinic profile, services CRUD, providers with availability |
| 3 | `milestone/booking-flow` | AIS-11, AIS-12, AIS-27, AIS-34 | Public booking wizard, slot generation, confirmation page |
| 4 | `milestone/admin-dashboard` | AIS-16, AIS-13, AIS-18, AIS-19, AIS-21 | Appointments page, filters, status transitions, manual booking modal |
| 5 | `milestone/patient-records` | AIS-55, AIS-56, AIS-61, AIS-62 | Patient table, detail drawer, booking history timeline, duplicate detection, role-based access |

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@lumierederm.ph` | `Admin123!` |
| Staff | `staff@lumierederm.ph` | `Staff123!` |

---

## Test Scenarios

### 1. Login & Auth

1. Go to `https://ianzro.github.io/bookingapp/`
2. You are redirected to `/#/login`
3. Enter **wrong password** → error message shown, no redirect
4. Enter admin credentials → redirected to `/#/admin/dashboard`
5. Refresh the page → stays logged in (session persisted in `localStorage`)
6. Click user area / logout → redirected back to `/#/login`
7. Navigate directly to `/#/admin/dashboard` while logged out → redirected to `/#/login`

---

### 2. Admin Dashboard

After logging in as **admin**:

- **Stat cards** show: today's appointments, pending confirmations, total patients, active services
- **Recent bookings** table shows the last 5 bookings with patient name, service, and status badge
- Numbers update in real time as you add or change bookings elsewhere

---

### 3. Clinic Profile (admin only)

1. In the sidebar, click **Clinic Profile** (under Settings)
2. Edit the clinic name, tagline, address, phone, email, or website
3. Toggle business hours on/off per day; change open/close times
4. Click **Save Changes** — values persist after page refresh
5. Log in as **staff** → the Settings section is hidden in the sidebar

---

### 4. Services (admin only)

1. Click **Services** in the sidebar
2. Click **Add Service** — fill in name, category, description, duration (minutes), price
3. Click the toggle on any service to activate/deactivate it
4. Click the edit icon to update a service
5. Deactivated services do not appear in the public booking wizard

---

### 5. Providers (admin only)

1. Click **Providers** in the sidebar
2. Click **Add Provider** — fill in name, specialty, credentials, bio
3. Toggle which services the provider offers
4. Set per-day availability time blocks (e.g. Mon 09:00–17:00, Wed closed)
5. A provider without availability blocks on a given day will show no slots for that day in the booking wizard

---

### 6. Patient Booking Wizard (public, no login required)

Go to `https://ianzro.github.io/bookingapp/#/book`

**Step 1 — Service**: Select any active service. Duration and price shown per item.

**Step 2 — Provider**: Only providers who offer the selected service are shown.

**Step 3 — Date & Time**:
- Pick a date using the calendar (past dates are disabled)
- Available time slots appear below the calendar
- Slots are generated from the provider's availability blocks, in 30-minute increments
- Slots that overlap existing confirmed/pending bookings are automatically hidden

**Step 4 — Your Details**: Fill in first name, last name, email, mobile, DOB (optional), gender, notes.
- If the email or mobile matches an existing patient, a gold warning box appears: "Existing patient found." You must click "Got it, continue →" before proceeding — the booking will be linked to the existing record.

**Step 5 — Review**: Summary of service, provider, date/time, and patient details. Estimated fee shown.

**Confirm**: Clicks creates the booking (status: `pending`), fires a notification to admin, and redirects to the confirmation page at `/#/book/confirmation/:id`.

**Confirmation page**: Shows the booking reference, full appointment summary, and patient contact info.

---

### 7. Admin Appointments Page

1. Log in and click **Appointments** in the sidebar
2. Three tabs: **Today**, **Upcoming**, **Past** — each with a live count badge
3. **Filters**: Filter by date range, provider, and status; click "Clear filters" to reset
4. **Status change**: Click the `⋮` menu on any row → "Change status"
   - Valid transitions only are shown (state machine enforced):
     - `pending` → Confirm or Cancel
     - `confirmed` → Mark Arrived, Cancel, or No-Show
     - `arrived` → Mark Completed
     - `completed` / `cancelled` / `no_show` → no further transitions
   - Cancellation and no-show require a reason (textarea shown)
5. **New Booking** button (top right): opens the Manual Booking Modal
   - Same 5-step wizard in a modal
   - Staff can search existing patients by name/email/mobile, or create a new one
   - Manual bookings are automatically set to `confirmed` (not `pending`) and tagged `bookedBy: staff`

---

### 8. Patient Records

1. Click **Patients** in the sidebar
2. Search by name, email, or mobile — results filter in real time
3. Click any row to open the **detail drawer** (slides in from the right)
4. Drawer shows: name, email, mobile, patient-since date
5. **Admin** also sees: date of birth and clinical notes (allergy info etc.)
6. **Staff** sees a notice that DOB and clinical notes are admin-only
7. The **Appointment History** timeline shows all bookings for that patient, newest first:
   - Completed appointments have a filled teal dot
   - Cancelled/no-show appointments have a grey dot
   - Pending/confirmed/arrived have a gold-outline dot
   - Cancel reasons are shown in italic red below the booking card
8. Click outside the drawer or the ✕ button to close

---

### 9. Notifications

1. Book a new appointment via the public booking wizard
2. The bell icon in the top bar shows a gold badge with the unread count
3. Click the bell → dropdown lists recent notifications, newest first
4. Unread notifications have a teal dot and a light teal background
5. Click a notification to mark it as read — dot disappears

---

### 10. Slot Overlap Prevention

1. Book a specific provider + date + time through the public wizard (e.g. Dr. Santos, Mon, 10:00 AM)
2. Go back to `/#/book` and try to book the same provider on the same date
3. The 10:00 AM slot (and any slot that would overlap the booked service duration) is no longer available

---

## Resetting Seed Data

If localStorage gets into a bad state during testing:

1. Open DevTools → Application → Storage → Local Storage → `https://ianzro.github.io`
2. Delete the `derm_seed_version` key
3. Refresh the page — all seed data is re-written from `src/seed/seedData.js`

Alternatively, clear all `derm_*` keys manually.

---

## Tech Notes

- **No backend** — all data in `localStorage`. Data is per-browser, not shared between users.
- **Auth** — passwords are compared using Web Crypto API SHA-256. Hashes are stored in `derm_users`.
- **Routing** — HashRouter (`/#/path`). Works on GitHub Pages without a 404 redirect hack.
- **Build** — Vite with `base: '/bookingapp/'`. Run `npm run build` to produce `dist/`.
- **Deploy** — GitHub Actions triggers on push to `main` and deploys `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages`.
