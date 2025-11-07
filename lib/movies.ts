"use client";

export type Movie = {
  id: string;
  title: string;
  publishingYear: number;
  posterDataUrl?: string;
};

const STORAGE_KEY = "movies_store_v1";

export function readMovies(): Movie[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Movie[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeMovies(movies: Movie[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export function addMovie(movie: Omit<Movie, "id">): Movie {
  const all = readMovies();
  const newMovie: Movie = { id: crypto.randomUUID(), ...movie };
  writeMovies([newMovie, ...all]);
  return newMovie;
}

export function updateMovie(id: string, update: Partial<Omit<Movie, "id">>) {
  const all = readMovies();
  const next = all.map((m) => (m.id === id ? { ...m, ...update } : m));
  writeMovies(next);
}

export function getMovie(id: string): Movie | undefined {
  return readMovies().find((m) => m.id === id);
}

export function ensureSeed() {
  const all = readMovies();
  if (all.length > 0) return;
  const samples: Movie[] = Array.from({ length: 8 }).map((_, i) => ({
    id: crypto.randomUUID(),
    title: `Movie ${i + 1}`,
    publishingYear: 2021,
    posterDataUrl: "/window.svg", // use public/svg as placeholder
  }));
  writeMovies(samples);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
