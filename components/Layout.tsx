"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-background text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <h1 className="text-3xl font-semibold">My movies</h1>
        <div className="flex items-center gap-3">
          {pathname?.startsWith("/movies") ? (
            <button
              className="btn-ghost"
              onClick={async () => {
                try {
                  await api("/auth/logout", { method: "POST" });
                } catch {}
                router.push("/sign-in");
              }}
            >
              Logout
            </button>
          ) : null}
          <Link
            href="/movies/new"
            className="btn-ghost"
            aria-label="Create movie"
          >
            + Add
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 pb-20">{children}</main>
      <footer className="pointer-events-none select-none">
        {/* subtle waves decoration */}
        <div className="h-24" />
      </footer>
    </div>
  );
}

export function CenterCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-svh grid place-items-center">
      <div className="w-full max-w-md card p-8">
        {title ? (
          <h2 className="mb-6 text-center text-4xl font-semibold">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
