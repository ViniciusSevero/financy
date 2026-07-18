import { cn } from "@/lib/utils"
import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-muted-foreground/70">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            icon ? "pl-11" : "px-4",
            rightElement ? "pr-11" : "pr-4",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3.5 text-muted-foreground/70 cursor-pointer select-none">
            {rightElement}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }