

## Plan: Login Page + Role-Based Document Access

The uploaded images are user story references (US-010 to US-103) covering authentication, PII, tokens, documents, RAG, and security. For this frontend MVP (no backend yet), we focus on what's implementable now: **login UI** and **role-based access restrictions**.

### What will be built

**1. Login Page (`src/pages/Login.tsx`)**
- Clean form with email + password fields
- Reads `?role=admin|user|guest` from URL params
- Admin/User: show login form, mock-authenticate (accept any credentials), set role in context, navigate to `/dashboard`
- Guest: auto-redirect to dashboard with guest role (no form needed, just a "Continuer en mode demo" button)
- Multilingual using existing `LanguageContext`
- Styled consistently with Landing page (glass-card, gradients)

**2. Landing Page update (`src/pages/Landing.tsx`)**
- Role cards navigate to `/login?role=admin` / `/login?role=user` / `/login?role=guest` instead of directly to `/dashboard`

**3. RoleContext update (`src/contexts/RoleContext.tsx`)**
- Add `isAuthenticated` boolean flag
- `setRole` also sets `isAuthenticated = true`

**4. AuthGuard component (`src/components/AuthGuard.tsx`)**
- Wraps protected routes; redirects to `/` if not authenticated

**5. Documents page update (`src/pages/Documents.tsx`)**
- Add download button per row (visible for admin/user only)
- Hide upload zone and import button for guest role
- Show "Acces reserve" message for guests on restricted actions

**6. Routing (`src/App.tsx`)**
- Add `/login` route
- Wrap dashboard routes with AuthGuard

**7. Translation keys (`src/contexts/LanguageContext.tsx`)**
- Add login-related strings: `login_title`, `login_email`, `login_password`, `login_submit`, `login_guest_continue`, `access_restricted`

### Files to create
- `src/pages/Login.tsx`
- `src/components/AuthGuard.tsx`

### Files to modify
- `src/pages/Landing.tsx` (navigate to `/login?role=...`)
- `src/pages/Documents.tsx` (role-based download/upload restrictions)
- `src/contexts/RoleContext.tsx` (add `isAuthenticated`)
- `src/contexts/LanguageContext.tsx` (add translation keys)
- `src/App.tsx` (add `/login` route, wrap with AuthGuard)

