"use client";
import { useToast, ToastType } from "../../../context/ToastContext";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex w-80 items-start gap-3 rounded-xl p-4 shadow-lg transition-all animate-in slide-in-from-bottom-full ${toast.type === "success"
                        ? "bg-white text-emerald-900 border border-emerald-100"
                        : "bg-white text-rose-900 border border-rose-100"
                        }`}
                >
                    <div className={`mt-0.5 shrink-0 rounded-full p-1 ${toast.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                        }`}>
                        {toast.type === "success" ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <p className="flex-1 text-sm font-medium">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="shrink-0 text-slate-400 hover:text-slate-600"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
