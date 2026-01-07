import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl",
                gradient:
                    "gradient-primary text-white shadow-lg hover:shadow-2xl hover:scale-105 glow-cyan",
                gradientSecondary:
                    "gradient-secondary text-white shadow-lg hover:shadow-2xl hover:scale-105 glow-purple",
                ghost:
                    "hover:bg-white/10 hover:text-white border border-white/20",
                outline:
                    "border-2 border-white/30 hover:border-white hover:bg-white/10 hover:text-white backdrop-blur-sm",
                glass:
                    "glass hover:bg-white/20 text-white",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-8 text-base",
                xl: "h-16 px-10 text-lg",
                icon: "h-11 w-11",
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
