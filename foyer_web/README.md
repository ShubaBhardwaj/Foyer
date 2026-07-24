# 🏢 Foyer — Enterprise Society Management Platform (Web Frontend)

Foyer is a modern, high-performance, enterprise-grade Web Application built for residential society management. It offers role-based access control (RBAC), interactive hierarchy tree visualization for towers and flats, strict structure lock protections, and seamless account linking via Clerk Authentication and MongoDB authorization.

---

## 🌟 Key Features

### 🔐 1. Authentication & Account Linking
* **Google OAuth via Clerk**: Seamless sign-in and sign-up powered by Clerk Auth SDK.
* **6-Character Case-Sensitive Unique ID Linking**: 
  * New Society Owners register directly via `/society/register`.
  * Pre-created users (Admins, Residents, Security Guards) link their Google account on first login using their unique 6-character code (e.g. `RgvKtk`).
* **Route Guards**:
  * `<AuthGuard>`: Protects dashboard routes and validates user session.
  * `<RoleGuard>`: Restricts feature actions strictly based on user roles (`owner`, `super_admin`, `admin`, `resident`, `guard`).

### 🏗️ 2. Society Structure Management
* **Interactive Hierarchy Tree View**: Collapsible visual layout of Towers, Floors, and Flats.
* **Live Occupancy Tracking**: Color-coded flat cards (`Vacant` vs `Occupied`) with search and filter controls.
* **Extensible Structure Locks**:
  * Prevents editing or deleting towers if any flat within the tower is currently occupied.
  * **Delete Tower Confirmation Modal**: Safe deletion of vacant tower blocks with confirmation safeguards.
* **Structure Generator & Expander**: Live preview counter for configuring new tower blocks, floors per tower, and flats per floor.

### 👥 3. Multi-Role User Governance
* **Dedicated User Table Tabs**: Categorized tabs with live counts for:
  * **Super Admins** (`super_admin`)
  * **Society Admins & Owners** (`admin`, `owner`)
  * **Residents** (`resident`)
  * **Security Guards** (`guard`)
  * **All Users**
* **Role Hierarchy Permissions**:
  * `Owner` → Creates `Super Admin` & Registers Society
  * `Super Admin` → Creates `Society Admin`, `Resident`, `Guard`
  * `Society Admin` → Creates `Resident`, `Guard`
* **Automated Multi-Role Assignment**: Users allocated to a flat are automatically assigned the `resident` role alongside their primary role.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Runtime & Package Manager** | Bun |
| **Styling** | Tailwind CSS v4, Lucide React |
| **State & Data Fetching** | TanStack Query v5, Axios |
| **Authentication** | Clerk Auth (@clerk/nextjs) |
| **Form Handling** | React Hook Form, Zod |
| **UI Components & Toasts** | Radix UI, Sonner, next-themes |

---

## 📁 Project Architecture

```
foyer_web/
├── src/
│   ├── app/                         # Next.js App Router Routes
│   │   ├── (auth)/                  # Auth group (Login)
│   │   ├── (dashboard)/             # Protected Dashboard routes
│   │   │   ├── dashboard/           # Overview metrics & quick actions
│   │   │   ├── society/             # Society details
│   │   │   ├── structure/           # Hierarchy tree & structure management
│   │   │   ├── users/               # User governance portal & creation forms
│   │   │   └── profile/             # User profile settings
│   │   ├── society/register/        # New owner society onboarding
│   │   └── sso-callback/            # Clerk OAuth callback route
│   ├── components/                  # Reusable UI & Shell Components
│   │   ├── guards/                  # AuthGuard & RoleGuard components
│   │   ├── layout/                  # AppShell, Sidebar, Header, Breadcrumbs
│   │   ├── shared/                  # DataTable, Badges, Spinners
│   │   └── ui/                      # Base UI elements (Button, Input, Card, Dialog)
│   ├── features/                    # Feature-First Business Logic
│   │   ├── auth/                    # LoginForm & Auth state
│   │   ├── society/                 # RegisterSocietyForm & validators
│   │   ├── structure/               # StructureTreeView, Generator & Update Dialogs
│   │   └── users/                   # UserTableTabs & CreateUser Forms
│   ├── hooks/                       # Custom React Hooks (useAuthUser)
│   ├── providers/                   # AppProviders (Clerk, QueryClient, Theme, Toast)
│   ├── services/api/                # Axios Client & API Services (auth, society, structure, users)
│   ├── types/                       # Central TypeScript Interface Definitions
│   └── constants/                   # QueryKeys, Role Enums & Navigation Maps
├── .env.local                       # Local Environment Configuration
├── README.md                        # Documentation
└── package.json
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xhc3NpYy1idWNrLTEzLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_GTjcKY9yIp9Phy1TbPuzq14GLycKpGKh9xs0vR7itb
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Start the Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
bun run build
```

---

## 📡 API Integration & Backend Connection

The web frontend communicates with the **Foyer Express/MongoDB Server** running on `http://localhost:8000`.

- **Axios Client Interceptor**: Automatically attaches the Clerk JWT Bearer Token to all outgoing API requests via `registerClerkTokenGetter`.
- **401 Interceptor**: Suppresses 401 alerts on public routes while automatically redirecting expired sessions to `/login`.

---

## 📜 License

Foyer Platform © 2026. All rights reserved.
