import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and twMerge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format date to Arabic locale
 */
export function formatDate(date: Date | string, locale: string = 'ar-SA'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
}

/**
 * Get greeting message based on time of day
 */
export function getGreeting(locale: string = 'ar'): string {
    const hour = new Date().getHours()

    if (locale === 'ar') {
        if (hour < 12) return 'صباح الخير'
        if (hour < 18) return 'مساء الخير'
        return 'مساء الخير'
    }

    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
}
