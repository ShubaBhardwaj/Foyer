"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Settings, Shield, Bell, Moon } from "lucide-react";

export default function SettingsPage() {
  const { user, society } = useAuthUser();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-400" /> Platform Settings
        </h1>
        <p className="text-xs text-slate-400">
          Preferences, theme toggles, and security settings
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5 text-purple-400" /> Theme & Appearance
          </CardTitle>
          <CardDescription>Toggle between Dark, Light, or System theme</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-200">Color Theme Preference</p>
            <p className="text-xs text-slate-400">Select your preferred color mode for Foyer interface</p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" /> Security & Clerk Integration
          </CardTitle>
          <CardDescription>Authentication parameters managed via Clerk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Authorization Identity Engine</span>
            <span className="font-semibold text-emerald-400">Clerk + MongoDB ODM</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400">User Mongoose Unique ID</span>
            <span className="font-mono text-purple-400 font-bold">#{user?.uniqueId}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
