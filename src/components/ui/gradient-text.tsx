import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'reverse';
  className?: string;
}

const gradientVariants = {
  'primary': 'bg-gradient-to-r from-candy-coral via-candy-peach to-candy-gold',
  'gold': 'bg-gradient-to-r from-candy-gold to-candy-peach',
  'reverse': 'bg-gradient-to-r from-candy-mint via-candy-gold to-candy-coral'
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