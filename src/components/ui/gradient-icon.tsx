import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientIconProps {
  children: ReactNode;
  variant?: 'red-orange' | 'orange-gold' | 'gold-red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gradientVariants = {
  'red-orange': 'bg-gradient-to-br from-toasted-brown to-warm-amber',
  'orange-gold': 'bg-gradient-to-br from-warm-amber to-golden-mustard', 
  'gold-red': 'bg-gradient-to-br from-golden-mustard to-earth-terracotta'
};

const sizeVariants = {
  'sm': 'w-10 h-10',
  'md': 'w-12 h-12',
  'lg': 'w-16 h-16'
};

export const GradientIcon = ({ 
  children, 
  variant = 'red-orange', 
  size = 'md',
  className 
}: GradientIconProps) => {
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center text-white',
      gradientVariants[variant],
      sizeVariants[size],
      className
    )}>
      {children}
    </div>
  );
};