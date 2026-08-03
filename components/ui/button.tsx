import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-[12px] shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 active:scale-[0.97]",
                destructive:
                    "bg-error text-white rounded-[12px] hover:bg-error-dark",
                outline:
                    "border border-border bg-transparent text-foreground rounded-[12px] hover:border-primary-500 hover:text-primary-500 hover:bg-primary-500/5",
                secondary:
                    "border border-border bg-transparent text-foreground rounded-[12px] hover:border-primary-500 hover:text-primary-500 hover:bg-primary-500/5",
                ghost:
                    "text-muted-foreground rounded-[12px] hover:text-foreground hover:bg-muted",
                link:
                    "text-primary-500 underline-offset-4 hover:underline",
                accent:
                    "bg-secondary-500 text-white rounded-[12px] hover:bg-secondary-600 shadow-lg shadow-secondary-500/20",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
