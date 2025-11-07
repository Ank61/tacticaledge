"use client";

import { PrimaryButton, TextField, FileField } from "@/components/ui/FormField";
import { api } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  mode: "create" | "edit";
  movieId?: string;
};

export default function MovieForm({ mode, movieId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [poster, setPoster] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && movieId) {
      (async () => {
        try {
          const m = await api<any>(`/movies/${movieId}`);
          setTitle(m.title);
          setYear(m.publishingYear);
          setPoster(m.poster);
        } catch {}
      })();
    }
  }, [mode, movieId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !year) {
      setError("Please fill in all fields");
      return;
    }
    try {
      if (mode === "create") {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("publishingYear", String(year));
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement | null;
        const f = fileInput?.files?.[0];
        if (f) fd.append("poster", f);
        await api(`/movies`, { method: "POST", body: fd as any });
      } else if (mode === "edit" && movieId) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("publishingYear", String(year));
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement | null;
        const f = fileInput?.files?.[0];
        if (f) fd.append("poster", f);
        await api(`/movies/${movieId}`, { method: "PATCH", body: fd as any });
      }
      router.push("/movies");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="lg:order-2">
        <div className="card overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden">
            (
            <Image
              src={poster || "/window.svg"}
              alt="Poster preview"
              fill
              className="object-cover"
            />
            )
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:order-1">
        <TextField
          label="Title"
          placeholder="Movie title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <TextField
          label="Publishing year"
          type="number"
          placeholder="e.g. 2021"
          value={year}
          onChange={(e) =>
            setYear(e.currentTarget.value ? Number(e.currentTarget.value) : "")
          }
        />
        <FileField
          label="Poster image"
          accept="image/*"
          onFileSelected={async (file) => {
            const url = URL.createObjectURL(file);
            setPoster(url);
          }}
        />
        {error ? (
          <div className="text-[color:var(--color-error)] text-sm">{error}</div>
        ) : null}
        <div className="flex gap-3 pt-2">
          <PrimaryButton type="submit">
            {mode === "create" ? "Save" : "Update"}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
