"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <Button type="button" variant="outline" onClick={onLogout} className="h-10 w-full rounded-lg px-4 text-sm">
      Logout
    </Button>
  );
}
