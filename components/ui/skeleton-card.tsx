'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
}

function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted/60',
                className
            )}
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
        </div>
    )
}

export function SkeletonDashboard() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Hero skeleton */}
            <div className="rounded-2xl bg-muted/40 p-8 h-36" />

            {/* Summary cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Content area skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <div className="space-y-3 pt-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-xl border border-border p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <div className="space-y-3 pt-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-xl bg-muted/40 p-3 flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-10" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex justify-between pt-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Skeleton }
