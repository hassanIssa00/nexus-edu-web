'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
    target: number | string
    duration?: number
    prefix?: string
    suffix?: string
    className?: string
}

export function AnimatedCounter({
    target,
    duration = 2000,
    prefix = '',
    suffix = '',
    className = ''
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const hasAnimated = useRef(false)

    // If target is a string like "98%", extract number
    const numericTarget = typeof target === 'string' ? parseFloat(target) : target
    const extractedSuffix = typeof target === 'string' ? target.replace(/[\d.]/g, '') : suffix

    useEffect(() => {
        if (!isInView || hasAnimated.current) return
        hasAnimated.current = true

        const startTime = performance.now()
        const startVal = 0

        function step(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.round(startVal + (numericTarget - startVal) * eased))
            if (progress < 1) requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
    }, [isInView, numericTarget, duration])

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue.toLocaleString('ar-SA')}{extractedSuffix || suffix}
        </span>
    )
}
