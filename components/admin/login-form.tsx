"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error || "Login failed.");
        return;
      }
      const nextPath = searchParams.get("from") || "/admin";
      router.replace(nextPath);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Login</h1>
        <p className="text-muted-foreground text-base">Enter your shared admin passcode.</p>
      </div>
      <Input
        type="password"
        value={passcode}
        onChange={(event) => setPasscode(event.target.value)}
        placeholder="Passcode"
        autoComplete="current-password"
        className="h-11 text-sm"
        required
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="h-11 w-full text-sm" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
