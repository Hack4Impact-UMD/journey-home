# CLAUDE.md

## Commands
```bash
npm run dev        # Dev server (localhost:3000, Turbopack)
npm run build      # Static export to /out
npm run lint       # ESLint
npm run test       # Playwright E2E tests
npm run emulators  # Firebase emulators with seeded data
```
Run `emulators` + `dev` in separate terminals. Login: `admin@test.com` / `password`.

## Stack
Next.js 16 (App Router, static export) + Firebase (Auth, Firestore, Storage, Functions) + TanStack React Query + Tailwind + shadcn/ui. Deployed to Firebase Hosting.

## Directory Layout
- `app/` — Pages. `providers.tsx` wraps app in Auth + React Query contexts.
- `components/` — Feature-organized: `auth/`, `form/`, `general/`, `donation-requests/`, `inventory/`, `pickups-deliveries/`, `control-panel/`, `icons/`, `ui/`
- `lib/services/` — All Firebase logic (`auth.ts`, `donations.ts`, `inventory.ts`, `users.ts`, `warehouseHistory.ts`). Never call Firestore from components.
- `lib/queries/` — React Query hooks wrapping services.
- `lib/firebase.ts` — Connects to emulators when `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`.
- `types/` — Shared TS types. `general.ts` holds cross-domain primitives (`Address`, `ContactInfo`, `LocationContact`, `ReviewStatus`). Domain files (`donations.ts`, `client-requests.ts`, etc.) import from `general.ts` rather than duplicating.
- `contexts/` — `AuthContext.tsx` → `useAuth()` returns `{ state: { currentUser, userData, loading }, signup, login, logout, refreshUser }`. Access role via `useAuth().state.userData?.role`. Call `refreshUser()` after manually writing to the `users` Firestore doc (e.g. updating `emailVerified`) to sync React state immediately without waiting for `onAuthStateChanged`.
- `functions/` — Cloud Functions (separate workspace, Node 20).

## Key Patterns
- **Data flow:** Components → `lib/queries/` → `lib/services/` → Firebase SDK
- **Auth/roles:** `useAuth().state.userData?.role` = `Admin` | `Case Manager` | `Volunteer`. `ProtectedRoute allow={[...]}` guards by role — redirect order: unauthenticated → `/login`, missing data → `/status/missing-user-data`, unverified email → `/status/verify-email`, pending approval → `/status/account-pending`, wrong role → `/status/invalid-perms`. Note: `/status/account-pending` and `/status/verify-email` do NOT use `ProtectedRoute` (it would loop); they use a manual auth guard or none at all.
- **Page layout:** Pages under an existing `layout.tsx` group (e.g. `inventory/*`, `user-management/*`) render content only — the layout file handles `ProtectedRoute` + `SideNavbar`. Standalone pages include the full layout directly in `page.tsx`. There is no TopNavbar — the SideNavbar is the only nav chrome. Standard layout content div: `flex-1 min-h-0 bg-[#F7F7F7] pt-8 pb-4 px-6 flex flex-col`. Tab-based layouts (user-management, donation-requests, pickups-deliveries) add a `<div className="flex gap-8 text-sm">` tab row with `border-b-2 border-primary text-primary` on the active tab using `pathname.startsWith(...)`. Inner content card: `bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col`.
- **Redirects:** Use `permanentRedirect` (from `next/navigation`) for static destination redirects. For role-based redirects, use `useAuth()` + `useRouter()` + `useEffect` in the page component — hooks fire regardless of what `ProtectedRoute` renders, so no child wrapper component is needed.
- **Multi-step forms:** Use `DonorFormContext` pattern (see `app/donate/`).
- **Path alias:** `@/` = project root.

## Firestore Collections
- `users` — `pending: null` (active) or `UserRole` (requesting that role). `emailVerified: boolean` mirrors Firebase Auth — synced automatically by `onAuthStateChanged` and manually via `updateEmailVerificationStatus` in `lib/services/users.ts`.
- `donation-requests` — Donations with per-item approval status
- `donors` — Donor contact history
- `inventory` — Warehouse items with photos
- `timeblocks` — Shifts/time blocks; queried via `lib/queries/timeblocks.ts` (`useTimeBlocks`, `setTimeblockToast`)
- `warehouseHistory` — `InventoryChange` audit log. Written atomically via `useInventoryCategories` set mutation (never written directly). Fields: `id`, `userId`, `timestamp`, `change: { category, oldQuantity, newQuantity }`, `reverted`. Queried via `lib/queries/warehouse-history.ts` (`useWarehouseHistory`).

## Pages
**Public:** `/login`, `/signup`, `/donate` (4-step form via `DonorFormContext`), `/status/*`

**Protected (all roles):** `/`, `/inventory/warehouse`, `/profile`

**Admin only:** `/donation-requests/new`, `/donation-requests/reviewed`, `/user-management/all-accounts`, `/user-management/account-requests`, `/user-management/past-donors`, `/pickups-deliveries/unscheduled`, `/pickups-deliveries/scheduled`, `/control-panel/warehouse-history`, `/client-requests/admin`

**Case Manager only:** `/client-requests/case-manager`, `/client-request-form` (no nav chrome — full-screen form)

**Admin + Case Manager:** `/client-requests` (redirects to role-specific sub-page)

`/inventory` → `/inventory/warehouse`, `/donation-requests` → `/donation-requests/new`, `/user-management` → `/user-management/all-accounts`, `/pickups-deliveries` → `/pickups-deliveries/unscheduled`, `/control-panel` → `/control-panel/warehouse-history` (all `permanentRedirect`). `/client-requests` redirects to `/admin` or `/case-manager` based on role.

## Env
Copy `.env.example` → `.env`. Emulator vars pre-configured. `NEXT_PUBLIC_FIREBASE_*` needed for production.

## Coding Preferences
- **Parallel writes:** Use `Promise.all` for independent Firestore writes — don't chain `await` calls that can run simultaneously.
- **Toast + await:** Use `toast.promise(promise, {...})` then `await promise` on the same variable so errors still propagate.
- **Modals:** Use `createPortal(..., document.body)` + `useEffect` to set `document.body.style.overflow = "hidden"` while open. Modal inner structure: sticky header bar outside scroll area, `flex-1 overflow-y-auto` scroll region, sticky footer bar outside scroll area. Both bars use `shadow-[0_±2px_6px_rgba(0,0,0,0.08)]` pointing inward.
- **Don't extract tiny single-use components** — inline them directly (e.g. a simple button doesn't need its own file)
- **Sidebar links:** Add nav items in `components/general/SideNav.tsx` using `SideNavbarLink` with `name`, `path`, `roles` (empty = all roles), and optional `icon` props.
- **Multi-select dropdown:** Reusable `DropdownMultiselect<T>` lives at `components/inventory/DropdownMultiselect.tsx` — use it anywhere, not just inventory.
- **Tailwind sizing:** Never use `px` units in arbitrary Tailwind values (e.g. no `w-[360px]`). Use numbered scale classes (`w-96`) when possible; use `rem` for arbitrary values (`w-[22.5rem]`).