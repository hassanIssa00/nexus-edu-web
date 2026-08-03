import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ActivityItem {
    id: string;
    user: {
        name: string;
        avatar?: string;
        initials: string;
    };
    action: string;
    target?: string;
    time: string;
}

interface ActivityFeedProps {
    items: ActivityItem[];
    className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
    return (
        <div className={cn("space-y-8", className)}>
            {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={item.user.avatar} alt={item.user.name} />
                        <AvatarFallback>{item.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                            <span className="font-semibold">{item.user.name}</span> {item.action}{" "}
                            {item.target && <span className="font-semibold text-primary">{item.target}</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
