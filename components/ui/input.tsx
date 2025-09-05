import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
              className={cn(
        "flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-current placeholder:text-gray-500 focus-visible:outline-none hover:border-gray-400 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-xs file:font-medium",
        className
      )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }