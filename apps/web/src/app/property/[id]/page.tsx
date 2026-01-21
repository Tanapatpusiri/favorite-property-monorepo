"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { propertyApi, type Property } from "../../../apis";
import PropertyImage from "../../components/PropertyImage";

export default function PropertyDetails() {
    const params = useParams();
    const id = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        propertyApi.getById(id)
            .then((data) => {
                if (cancelled) return;
                setProperty(data);
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : "Failed to load property");
            })
            .finally(() => {
                if (cancelled) return;
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-white">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                    {/* Back button skeleton */}
                    <div className="mb-6 h-10 w-32 animate-pulse rounded-xl bg-slate-200" />

                    {/* Image skeleton */}
                    <div className="h-80 w-full animate-pulse rounded-2xl bg-slate-200 sm:h-96" />

                    {/* Content skeleton */}
                    <div className="mt-6 space-y-4">
                        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
                        <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                        <div className="h-6 w-1/4 animate-pulse rounded bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-dvh bg-white">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to listings
                    </Link>

                    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center">
                        <div className="text-base font-semibold text-rose-800">
                            {error || "Property not found"}
                        </div>
                        <div className="mt-1 text-sm text-rose-600">
                            The property you're looking for doesn't exist or couldn't be loaded.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                {/* Back button */}
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to listings
                </Link>

                {/* Property Image */}
                <div className="overflow-hidden rounded-2xl shadow-lg">
                    <PropertyImage
                        src={property.image}
                        alt={property.title}
                        className="h-80 w-full sm:h-96"
                    />
                </div>

                {/* Property Details */}
                <div className="mt-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {property.title}
                            </h1>
                            <div className="mt-2 flex items-center gap-2 text-slate-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {property.location}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-900 px-5 py-3 text-white">
                            <div className="text-xs uppercase tracking-wide text-slate-400">Price</div>
                            <div className="text-xl font-bold">฿{property.price.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Property Info Cards */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm text-slate-600">Property ID</div>
                            <div className="mt-1 font-semibold text-slate-900">{property.id}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm text-slate-600">Location</div>
                            <div className="mt-1 font-semibold text-slate-900">{property.location}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm text-slate-600">Status</div>
                            <div className="mt-1 font-semibold text-emerald-600">Available</div>
                        </div>
                    </div>

                    {/* Description placeholder */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                        <p className="mt-2 text-slate-600 leading-relaxed">
                            Beautiful property located in {property.location}. This stunning property offers
                            modern amenities and is situated in a prime location. Perfect for those seeking
                            comfort and convenience in one of the most desirable areas.
                        </p>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-6">
                        <h3 className="font-semibold text-slate-900">Interested in this property?</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Contact us to schedule a viewing or get more information.
                        </p>
                        <button className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
                            Contact Agent
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
