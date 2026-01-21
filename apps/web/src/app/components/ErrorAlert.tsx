"use client";

interface ErrorAlertProps {
    message: string;
    onDismiss?: () => void;
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
    return (
        <div className="mb-6 animate-in slide-in-from-top-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-rose-100 p-1">
                    <svg
                        className="h-5 w-5 text-rose-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-rose-800">Error</p>
                    <p className="mt-1 text-sm text-rose-700">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="shrink-0 rounded-lg p-1 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
