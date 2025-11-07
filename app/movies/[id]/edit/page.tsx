"use client";

import { AppShell } from "@/components/Layout";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const MovieForm = dynamic(() => import("../../MovieForm"), { ssr: false });

export default function EditMoviePage() {
  const params = useParams<{ id: string }>();
  const movieId = params?.id as string;
  return (
    <AppShell>
      <h2 className="mb-6 text-2xl font-semibold">Edit movie</h2>
      <MovieForm mode="edit" movieId={movieId} />
    </AppShell>
  );
}
