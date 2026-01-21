"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userApi } from "../../../apis";
import ErrorAlert from "../../components/ErrorAlert";
import { useToast } from "../../../context/ToastContext";

export default function CreateUser() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await userApi.create(username);
            showToast(`User ${username} created successfully`, "success");
            // Redirect to home with the new user selected (we'd ideally persist this or pass it via query)
            // For now, just go home and let them select it
            router.push("/");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to create user";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-white text-slate-900">
            <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Create a new user profile to start saving your favorite properties.
                    </p>
                </div>

                {error && (
                    <ErrorAlert message={error} onDismiss={() => setError(null)} />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/50"
                                placeholder="e.g. alice, bob"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                            Only letters, numbers, and underscores allowed.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !username.trim()}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                        {isLoading ? (
                            <>
                                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            "Create User"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
