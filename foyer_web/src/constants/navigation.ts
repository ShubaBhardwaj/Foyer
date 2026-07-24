import {
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  UserPlus,
  Settings,
  User,
  ShieldAlert,
  HelpCircle,
  FileText,
  Calendar,
  MessageSquare,
  Vote,
  Bell,
  Wrench,
  Car,
  Coffee,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Role } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: Role[];
  badge?: string;
  isFutureModule?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "super_admin", "admin"],
  },
  {
    title: "Society Details",
    href: "/society",
    icon: Building2,
    roles: ["owner", "super_admin", "admin"],
  },
  {
    title: "Society Structure",
    href: "/structure",
    icon: Layers,
    roles: ["owner", "super_admin", "admin"],
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
    roles: ["owner", "super_admin", "admin"],
  },
];

export const USER_CREATE_NAV_ITEMS: NavItem[] = [
  {
    title: "Create Super Admin",
    href: "/users/create/super-admin",
    icon: UserPlus,
    roles: ["owner"],
  },
  {
    title: "Create Society Admin",
    href: "/users/create/admin",
    icon: UserPlus,
    roles: ["super_admin"],
  },
  {
    title: "Create Resident",
    href: "/users/create/resident",
    icon: UserPlus,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Create Guard",
    href: "/users/create/guard",
    icon: UserPlus,
    roles: ["super_admin", "admin"],
  },
];

export const FUTURE_MODULE_NAV_ITEMS: NavItem[] = [
  { title: "Visitors", href: "/visitors", icon: ShieldAlert, isFutureModule: true },
  { title: "Complaints", href: "/complaints", icon: MessageSquare, isFutureModule: true },
  { title: "Notices", href: "/notices", icon: Bell, isFutureModule: true },
  { title: "Polls", href: "/polls", icon: Vote, isFutureModule: true },
  { title: "Maintenance", href: "/maintenance", icon: Wrench, isFutureModule: true },
  { title: "Parking", href: "/parking", icon: Car, isFutureModule: true },
  { title: "Amenities", href: "/amenities", icon: Coffee, isFutureModule: true },
  { title: "Payments", href: "/payments", icon: CreditCard, isFutureModule: true },
  { title: "Analytics", href: "/analytics", icon: BarChart3, isFutureModule: true },
];

export const SETTINGS_NAV_ITEMS: NavItem[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
