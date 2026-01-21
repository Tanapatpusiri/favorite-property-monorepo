"use client";
/// <reference types="react" />
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { propertyApi, userApi, favoriteApi, type Property, type User } from "../apis";
import PropertyImage from "./components/PropertyImage";
import ErrorAlert from "./components/ErrorAlert";
import PropertyCardSkeleton from "./components/PropertyCardSkeleton";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setIsLoadingProperties(true);
    setError(null);
    propertyApi.getAll()
      .then((data) => {
        if (cancelled) return;
        setProperties(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load properties");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingProperties(false);
      });

    // Fetch Users
    userApi.getAll()
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
      })
      .catch((e) => {
        console.error("Failed to load users", e);
        showToast("Failed to load users list", "error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setFavorites([]);
      return;
    }

    setIsLoadingFavorites(true);
    setError(null);
    favoriteApi.getAll(userId)
      .then((data) => {
        if (cancelled) return;
        setFavorites(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load favorites");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingFavorites(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const toggle = async (pid: string) => {
    if (!userId) {
      showToast("Please select a user first", "error");
      return;
    }

    setError(null);
    const isFav = favoriteSet.has(pid);
    try {
      setIsLoadingFavorites(true);
      if (isFav) {
        await favoriteApi.remove(userId, pid);
      } else {
        await favoriteApi.add(userId, pid);
      }
      setFavorites(await favoriteApi.getAll(userId));
      showToast(
        isFav ? "Removed from favorites" : "Added to favorites",
        "success"
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update favorites";
      showToast(msg, "error");
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Favorite Properties
            </h1>
            <p className="mt-0.5 text-sm text-slate-600">
              Browse listings and save favorites per user.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs text-slate-500 sm:block">
              <div className="font-medium text-slate-700">
                Active user
              </div>
              <div>{userId ? userId : "none selected"}</div>
            </div>

            <div className="relative">
              <select
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
                value={userId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setUserId(e.target.value)
                }
              >

                <option value="">Select user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href="/user/create"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200/70"
            >
              + New User
            </Link>
          </div>
        </div>

      </header >

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              {isLoadingProperties ? "Loading properties…" : `${properties.length} listings`}
            </div>
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              {userId
                ? isLoadingFavorites
                  ? "Loading favorites…"
                  : `${favorites.length} favorites`
                : "Select a user to favorite"}
            </div>
          </div>
        </div>

        {isLoadingProperties ? (
          <PropertyCardSkeleton count={6} />
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-base font-semibold">No properties found</div>
            <div className="mt-1 text-sm text-slate-600">
              Your API returned an empty list.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p: Property) => {
              const isFav = favoriteSet.has(p.id);
              const disabled = !userId || isLoadingFavorites;
              return (
                <article
                  key={p.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Link href={`/property/${p.id}`} className="block relative">
                    <PropertyImage
                      src={p.image}
                      alt={p.title}
                      className="h-44 w-full transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white">
                      {p.location}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/property/${p.id}`} className="min-w-0 hover:text-slate-700">
                        <h3 className="truncate text-base font-semibold tracking-tight">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          ฿{p.price.toLocaleString()}
                        </p>
                      </Link>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${isFav
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                      >
                        {isFav ? "Favorited" : "Not favorited"}
                      </span>
                    </div>

                    <button
                      className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-4 ${disabled
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : isFav
                          ? "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-200/70"
                          : "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300"
                        }`}
                      onClick={() => toggle(p.id)}
                      disabled={disabled}
                      aria-disabled={disabled}
                    >
                      {isLoadingFavorites
                        ? "Updating…"
                        : isFav
                          ? "Remove from favorites"
                          : "Add to favorites"}
                    </button>
                    {!userId ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Select a user to enable favorites.
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
          Tip: pick a user, then use the button on each card to add/remove favorites.
        </footer>
      </main >
    </div >
  );
}
