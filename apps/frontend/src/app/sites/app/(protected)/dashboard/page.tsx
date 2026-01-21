"use client";
import { RequireAuth } from "@/lib/auth/RequireAuth";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div>Dashboard</div>
    </RequireAuth>
  );
}