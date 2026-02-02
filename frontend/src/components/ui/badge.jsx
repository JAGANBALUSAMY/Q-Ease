import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-success/10 text-success border-success/20",
        warning: "border-transparent bg-warning/10 text-warning border-warning/20",
        info: "border-transparent bg-info/10 text-info border-info/20",
        pending: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        called: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse",
        served: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        cancelled: "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
