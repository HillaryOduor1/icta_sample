import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils"
import { trackEvent } from '../analytics';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0d1b14] text-white hover:bg-slate-800",
        primary: "bg-primary text-[#0d1b14] hover:bg-primary/90 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
        secondary: "bg-white/20 text-[#0d1b14] hover:bg-white/30 border border-[#0d1b14]/10",
        ghost: "hover:bg-white/10 text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e);
      trackEvent(`button_click_${variant || 'default'}`);
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    };
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
/*
// components/Button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils"
import { trackEvent } from '../analytics';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0d1b14] text-white hover:bg-slate-800",
        primary: "bg-primary text-[#0d1b14] hover:bg-primary/90 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
        secondary: "bg-white/20 text-[#0d1b14] hover:bg-white/30 border border-[#0d1b14]/10",
        ghost: "hover:bg-white/10 text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e);
      trackEvent(`button_click_${variant || 'default'}`);
    };
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };*/
