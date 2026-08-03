import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export interface TimelineItem {
    id: string;
    title: string;
    description?: string;
    date: string;
    status: "completed" | "current" | "upcoming";
}

interface TimelineProps {
    items: TimelineItem[];
    className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
    return (
        <div className={cn("space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent", className)}>
            {items.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {item.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : item.status === "current" ? (
                            <Clock className="w-5 h-5 animate-pulse" />
                        ) : (
                            <Circle className="w-5 h-5" />
                        )}
                    </div>

                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800 shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                            <time className="font-caveat font-medium text-indigo-500">{item.date}</time>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-sm">{item.description}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
