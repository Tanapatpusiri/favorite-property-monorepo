"use client";
import { useState } from "react";

const DEFAULT_IMAGE = "/default-property.svg";

interface PropertyImageProps {
    src?: string | null;
    alt: string;
    className?: string;
}

export default function PropertyImage({ src, alt, className = "" }: PropertyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const imageSrc = hasError || !src ? DEFAULT_IMAGE : src;

    return (
        <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
            {/* Skeleton loading */}
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-slate-200" />
            )}

            <img
                src={imageSrc}
                alt={alt}
                className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
            />
        </div>
    );
}
