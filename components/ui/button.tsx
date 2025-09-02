import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  size?: "default" | "small" | "large"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 border-gray-300"
    }
    
    const sizeClasses = {
      default: "px-4 py-2 text-sm",
      small: "px-3 py-1 text-sm",
      large: "px-6 py-3 text-base"
    }
    
    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
