import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-110 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gray-50 text-[#161616] hover:bg-gray-100 hover:shadow-2xl shadow-lg hover:shadow-xl",
        white: "bg-white text-[#161616] hover:bg-gray-50 hover:shadow-2xl shadow-lg hover:shadow-xl",
        card: "bg-gray-50 text-[#161616] hover:bg-gray-100 hover:shadow-2xl shadow-lg hover:shadow-xl", // For buttons on white cards
        link: "text-current underline-offset-4 hover:underline hover:text-gray-600 bg-transparent shadow-none hover:scale-105",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs", /* h-10 -> h-9, text-sm -> text-xs */
        sm: "h-7 rounded-md px-3 text-xs", /* h-8 -> h-7 */
        lg: "h-10 rounded-lg px-6 text-sm", /* h-12 -> h-10, text-base -> text-sm */
        icon: "h-9 w-9", /* h-10 -> h-9 */
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
