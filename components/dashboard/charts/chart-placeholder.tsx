import { cn } from "@/lib/utils";
import { BarChart3, LineChart, PieChart } from "lucide-react";

interface ChartPlaceholderProps {
    type?: "bar" | "line" | "pie";
    title?: string;
    height?: number | string;
    className?: string;
}

export function ChartPlaceholder({
    type = "bar",
    title = "Chart Data",
    height = 300,
    className,
}: ChartPlaceholderProps) {
    const Icon = type === "line" ? LineChart : type === "pie" ? PieChart : BarChart3;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-4 text-center animate-in fade-in-50",
                className
            )}
            style={{ height }}
        >
            <div className="rounded-full bg-muted p-3 mb-3">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
                Chart visualization will be rendered here using Recharts.
            </p>
        </div>
    );
}
