"use client";

import { AppShell } from "@/components/Layout";
import dynamic from "next/dynamic";

const MovieForm = dynamic(() => import("../MovieForm"), { ssr: false });

export default function NewMoviePage() {
  return (
    <AppShell>
      <h2 className="mb-6 text-2xl font-semibold">Create movie</h2>
      <MovieForm mode="create" />
    </AppShell>
  );
}
