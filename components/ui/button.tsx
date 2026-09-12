import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: 
          "bg-primary text-white hover:bg-primary/90 hover:shadow-md active:bg-primary/80",
        secondary: 
          "bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-sm active:bg-slate-300 border border-slate-200",
        outline: 
          "border-2 border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm active:bg-slate-100",
        ghost: 
          "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        danger: 
          "bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:bg-red-800",
        success: 
          "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:bg-emerald-800",
        warning: 
          "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md active:bg-amber-700",
        blue: 
          "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:bg-blue-800",
        purple: 
          "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md active:bg-purple-800",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };