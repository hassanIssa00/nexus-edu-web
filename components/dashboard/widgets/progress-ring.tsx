import { cn } from "@/lib/utils";

interface ProgressRingProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    className?: string;
    children?: React.ReactNode;
}

export function ProgressRing({
    value,
    size = 120,
    strokeWidth = 10,
    color = "text-primary",
    className,
    children,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90 w-full h-full"
            >
                <circle
                    className="text-muted/20"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn("transition-all duration-1000 ease-in-out", color)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children || <span className="text-xl font-bold">{Math.round(value)}%</span>}
            </div>
        </div>
    );
}
