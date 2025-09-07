import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center border border-black bg-white text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "",
        white: "",
        card: "",
        link: "border-none bg-transparent hover:bg-transparent hover:text-black underline",
      },
      size: {
        default: "h-8 px-3 text-sm",
        sm: "h-6 px-2 text-xs",
        lg: "h-10 px-4 text-base",
        icon: "h-8 w-8",
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
