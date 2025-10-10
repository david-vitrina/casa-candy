import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'reverse';
  className?: string;
}

const gradientVariants = {
  'primary': 'bg-gradient-to-r from-toasted-brown via-warm-amber to-golden-mustard',
  'gold': 'bg-gradient-to-r from-golden-mustard to-warm-amber',
  'reverse': 'bg-gradient-to-r from-golden-mustard via-warm-amber to-toasted-brown'
};

export const GradientText = ({ 
  children, 
  variant = 'primary',
  className 
}: GradientTextProps) => {
  return (
    <span className={cn(
      'bg-clip-text text-transparent',
      gradientVariants[variant],
      className
    )}>
      {children}
    </span>
  );
};