import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'reverse';
  className?: string;
}

const gradientVariants = {
  'primary': 'bg-gradient-to-r from-spanish-red via-spanish-orange to-spanish-gold',
  'gold': 'bg-gradient-to-r from-spanish-gold to-spanish-orange',
  'reverse': 'bg-gradient-to-r from-spanish-gold via-spanish-orange to-spanish-red'
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