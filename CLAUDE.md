# CLAUDE.md

## Commands
```bash
npm run dev        # Dev server (localhost:3000, Turbopack)
npm run build      # Standalone build
npm run lint       # ESLint
npm run test       # Playwright E2E
npm run emulators  # Firebase emulators with seeded data
```
Run `emulators` + `dev` in separate terminals. Login: `admin@test.com` / `password`.

## Stack
Next.js 16 (App Router, standalone) + Firebase (Auth, Firestore, Storage, Functions) + TanStack React Query + Tailwind + shadcn/ui. Deployed to Firebase Hosting.

## Architecture
- **Data flow:** Components → `lib/queries/` (React Query) → `lib/services/` (Firebase) → SDK. Never call Firestore from components.
- **Auth:** `useAuth().state` = `{ currentUser, userData, loading }`. Role via `userData?.role` = `Admin` | `Case Manager` | `Volunteer`. Call `refreshUser()` after manually writing to the `users` doc to sync without waiting for `onAuthStateChanged`.
- **ProtectedRoute:** `allow={[...]}` redirect order: unauthenticated → `/login`, missing data → `/status/missing-user-data`, unverified → `/status/verify-email`, pending → `/status/account-pending`, wrong role → `/status/invalid-perms`. `/status/verify-email` and `/status/account-pending` skip `ProtectedRoute` (would loop).
- **Page layout:** Pages under a group `layout.tsx` render content only — layout handles `ProtectedRoute` + `SideNavbar`. No TopNavbar. Tab-based layouts (user-management, donation-requests, pickups-deliveries) use `pathname.startsWith(...)` for active tab styling.
- **Redirects:** `permanentRedirect` for static destinations. Role-based: `useAuth()` + `useRouter()` + `useEffect` in the page component.
- **Types:** `types/general.ts` holds shared primitives (`Address`, `ContactInfo`, `LocationContact`, `ReviewStatus`); domain files import from there, never duplicate.

## Firestore
- `users` — `pending: null` (active) or `UserRole` (role being requested). `emailVerified` synced by `onAuthStateChanged` or manually via `updateEmailVerificationStatus`.
- `warehouseHistory` — written atomically via `useInventoryCategories` only, never directly. Fields: `id`, `userId`, `timestamp`, `change: { category, oldQuantity, newQuantity }`, `reverted`.
- `donation-requests`, `donors`, `inventory`, `timeblocks`

## Pages
- **Public:** `/login`, `/signup`, `/donate` (4-step `DonorFormContext`), `/status/*`
- **All roles:** `/`, `/inventory/warehouse`, `/profile`
- **Admin:** `/donation-requests/{new,reviewed}`, `/user-management/{all-accounts,account-requests,past-donors}`, `/pickups-deliveries/{unscheduled,scheduled}`, `/control-panel/warehouse-history`, `/client-requests/admin`
- **Case Manager:** `/client-requests/case-manager`, `/client-request-form` (full-screen, no nav). `/` redirects Case Managers to `/client-requests` via `useRouter().replace`.
- **Admin + Case Manager:** `/client-requests` → redirects by role
- Shortcut `permanentRedirect`s: `/inventory`, `/donation-requests`, `/user-management`, `/pickups-deliveries`, `/control-panel` → each default sub-page.

## Env
Copy `.env.example` → `.env`. Emulator vars pre-configured; `NEXT_PUBLIC_FIREBASE_*` for production.

## Conventions
- **Parallel writes:** `Promise.all` for independent Firestore writes.
- **Errors:** `toast.promise(p)` then `await p`. Never empty `catch` — only catch known error codes, always rethrow unexpected.
- **Loading/error states:** Inline with ternary inside the existing layout — never early-return duplicating `ProtectedRoute` + `SideNavbar`.
- **Modals:** `createPortal(..., document.body)` + `overflow: hidden` on body. Structure: sticky header / `flex-1 overflow-y-auto` body / sticky footer. Both bars shadow inward: `shadow-[0_±2px_6px_rgba(0,0,0,0.08)]`.
- **Components:** Don't extract single-use components — inline them.
- **Sidebar links:** `SideNavbarLink` in `components/general/SideNav.tsx` — props: `name`, `path`, `roles` (empty = all), optional `icon`. Active state uses exact match for `/`, `startsWith` otherwise. Icons from `@phosphor-icons/react` use `className="w-5 h-5"` (not the `size` prop); wrap in a local `() =>` component to satisfy `React.FC` type.
- **Multi-select:** `DropdownMultiselect<T>` at `components/inventory/DropdownMultiselect.tsx` — reusable anywhere.
- **Tailwind sizing:** No `px` in arbitrary values. Use scale classes (`w-96`) or `rem` (`w-[22.5rem]`).
