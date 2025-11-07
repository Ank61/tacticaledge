"use client";

import { AppShell } from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function MoviesPage() {
  const [isReady, setIsReady] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [total, setTotal] = useState(0);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await api<any[]>(`/movies?page=${page}&limit=${pageSize}`);
        const count = await api<number>(`/movies/count`);
        setMovies(list);
        setTotal(Number(count));
      } finally {
        setIsReady(true);
      }
    })();
  }, [page]);

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isReady &&
          movies.map((m) => (
            <article key={m._id || m.id} className="card overflow-hidden">
              <div className="relative aspect-[3/4] bg-[#0d3a49] overflow-hidden">
                {m.poster && m.poster.startsWith("http") ? (
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={m.poster || "/window.svg"}
                    alt={m.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="text-white/70 text-sm">{m.publishingYear}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/movies/${m._id || m.id}/edit`}
                    className="btn-ghost text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn-ghost text-sm text-[color:var(--color-error)]"
                    onClick={async () => {
                      await api(`/movies/${m._id || m.id}`, {
                        method: "DELETE",
                      });
                      const list = await api<any[]>(
                        `/movies?page=${page}&limit=${pageSize}`
                      );
                      const count = await api<number>(`/movies/count`);
                      setMovies(list);
                      setTotal(Number(count));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* pagination */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          className="btn-ghost"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="rounded-md bg-white/10 px-3 py-1">{page}</span>
        <button
          className="btn-ghost"
          disabled={page * pageSize >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </AppShell>
  );
}
