import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        trend: "up" | "down";
    };
    icon?: LucideIcon;
    className?: string;
}

export function KPICard({ title, value, change, icon: Icon, className }: KPICardProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className={cn(
                        "text-xs mt-1",
                        change.trend === "up" ? "text-green-600" : "text-red-600"
                    )}>
                        {change.trend === "up" ? "+" : "-"}{Math.abs(change.value)}% من الشهر السابق
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
