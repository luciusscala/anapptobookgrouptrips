import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none hover:scale-105 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-black",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-grey-800 active:bg-grey-900 shadow-sm",
        secondary: "bg-grey-100 text-black hover:bg-grey-200 active:bg-grey-300 border border-grey-300",
        outline: "bg-white text-black border border-grey-400 hover:bg-grey-50 active:bg-grey-100",
        ghost: "bg-transparent text-black hover:bg-grey-100 active:bg-grey-200",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 shadow-sm",
        link: "bg-transparent text-black hover:text-grey-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-10 w-10 rounded-md",
        xs: "h-6 px-2 text-xs rounded",
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
