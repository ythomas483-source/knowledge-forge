

## Plan: New Landing Page with Role Selection, Multilingual & Swiss Branding

### Overview

Replace the current `Index.tsx` (dashboard) with a proper **landing/welcome page** that serves as the entry point before the dashboard. The landing page will highlight:

1. **RBAC Role Selection** -- 3 prominent cards for Admin, Utilisateur (Collaborateur), Guest
2. **Multilingual support** (FR, IT, DE, EN) with Swiss branding
3. **AI-powered content generation** messaging
4. **Client/Server architecture** explanation section

The current dashboard content moves to `/dashboard`.

### What will be built

**1. New Landing Page (`src/pages/Landing.tsx`)**

A full-screen, visually striking page (no sidebar) with:

- **Hero section**: LearnForge branding with Swiss flag accent, tagline "Knowledge-to-Learning Engine", animated gradient background
- **Language switcher** in the top-right corner: FR | IT | DE | EN (stored in React context, UI-only for now)
- **3 Role Cards** (center stage, large, animated with framer-motion):
  - **Admin** (Shield icon) -- "Creez des formations, gerez les sources et les acces"
  - **Collaborateur** (Users icon) -- "Suivez vos formations, personnalisez vos objectifs"  
  - **Invite** (Eye icon) -- "Decouvrez la plateforme en mode demo"
  - Each card clickable, navigates to `/dashboard` with role stored in state
  - RBAC badge/label on each card
- **Feature highlights strip**: AI Generation, RAG Engine, Multi-tenant, Swiss Hosting
- **Architecture section**: Brief client/server visual (frontend React + backend infra) with Infomaniak/Swiss datacenter mention
- **Footer**: Made in Switzerland, supported languages

**2. Language Context (`src/contexts/LanguageContext.tsx`)**

- Simple React context with `locale` state (fr/it/de/en)
- Translation dictionary for landing page strings in all 4 languages
- Provider wrapping the app

**3. Role Context (`src/contexts/RoleContext.tsx`)**

- Stores selected role (admin/user/guest) in React state
- Used by `DashboardLayout` and `AppSidebar` instead of hardcoded prop

**4. Routing changes (`src/App.tsx`)**

- `/` → new `Landing` page
- `/dashboard` → current `Index` (dashboard)
- All other routes unchanged
- Wrap routes with `LanguageProvider` and `RoleProvider`

**5. Minor updates**

- `DashboardLayout` reads role from `RoleContext` instead of prop
- `AppSidebar` reads role from `RoleContext`

### Technical details

- All translations stored as a flat JSON object keyed by locale, no external i18n library needed for MVP
- Role selection uses `useNavigate` to go to `/dashboard` after setting role in context
- Landing page is standalone (no sidebar), uses framer-motion for card entrance animations
- Swiss cross icon rendered as SVG inline or via a small component

### Files to create
- `src/pages/Landing.tsx`
- `src/contexts/LanguageContext.tsx`
- `src/contexts/RoleContext.tsx`

### Files to modify
- `src/App.tsx` (new route `/dashboard`, landing at `/`)
- `src/components/DashboardLayout.tsx` (use RoleContext)
- `src/components/AppSidebar.tsx` (use RoleContext)

