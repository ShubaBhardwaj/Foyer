# 📱 Foyer Mobile Client (`foyer_mobile`)

> **The mobile operational client for Foyer — engineered for residents, gate security guards, and society administrators.**

---

## 🎨 Mobile Design System & UI Engine

`foyer_mobile` features a custom-built, enterprise-grade atomic design system built on top of Expo Router, React Native Reanimated, and custom HSL theme tokens.

### 🌟 Key Visual Highlights
1. **Custom Native Splash & Branding**:
   - Replaced default Expo blue screen with a modern Dark Slate (`#0F172A`) backdrop, branded Foyer splash logo, and dark status bar configuration.
2. **Plus Jakarta Sans Typography**:
   - Native integration of **Plus Jakarta Sans** (`Regular`, `Medium`, `SemiBold`, `Bold`) with font scaling and preset levels (`h1` through `caption`).
3. **19+ Custom UI Components**:
   - `AppScreen` (Safe Area wrapper)
   - `AppButton` & `AppIconButton`
   - `AppTextField` & `AppSearchBar`
   - `AppCard` (Elevated, Outlined, Flat)
   - `AppAvatar` & `AppAvatarPicker`
   - `AppBadge` & `AppStatusPill`
   - `AppChip` & `AppSegmentedControl`
   - `AppListRow` & `AppEmptyState`
   - `AppBottomSheet` & `AppDialog`
   - `AppOtpInput` & `AppLoader`
   - `AppDivider` & `Typography`
4. **Theme & Dark Mode Support**:
   - Theme provider (`app-provider.tsx`) with dark mode support and dynamic HSL color tokens (`theme.ts`).
5. **Interactive Developer Showcase**:
   - Explore and test all UI components live in the app via the `/dev/design-system` developer route.

---

## 📁 Directory Structure

```
foyer_mobile/
├── assets/
│   ├── fonts/                   # PlusJakartaSans font files
│   └── images/                  # Branded app icons & dark splash screen assets
├── src/
│   ├── app/                     # Expo Router file-based navigation
│   │   ├── (app)/               # Main application tabs and stack routes
│   │   ├── (auth)/              # Authentication screens
│   │   └── dev/                 # /dev/design-system showcase route
│   ├── components/
│   │   └── ui/                  # 19+ Atomic UI Primitives
│   ├── providers/               # ThemeProvider, ClerkProvider, AppProvider
│   └── theme/                   # Theme tokens, colors, typography scales
├── app.json                     # Expo config & splash configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 20.0.0`
- **Bun**: `>= 1.1.0` (Recommended) or `pnpm`
- **Expo Go App** (iOS / Android) or Simulator

### Installation & Launch

```bash
# Install dependencies
bun install

# Start the Expo development server
npx expo start
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code using Expo Go.

---

## 🎨 Accessing the Design System Showcase

While running the app in development mode, navigate to:
```
/dev/design-system
```
This screen presents interactive previews, state toggles, dialog triggers, and layout demonstrations for all design system primitives.
