import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'spanish' | 'outline-spanish';
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ variant = 'spanish', className, ...props }, ref) => {
    const variantStyles = {
      'spanish': 'bg-gradient-to-r from-candy-coral to-candy-peach hover:from-candy-coral-dark hover:to-candy-peach/90 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-candy',
      'outline-spanish': 'border-2 border-candy-coral text-candy-coral hover:bg-candy-coral hover:text-white transition-all duration-300'
    };

    return (
      <Button
        ref={ref}
        className={cn(variantStyles[variant], className)}
        variant={variant === 'outline-spanish' ? 'outline' : 'default'}
        {...props}
      />
    );
  }
);

GradientButton.displayName = "GradientButton";