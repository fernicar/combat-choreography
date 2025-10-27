import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { soundPlayer } from "@/lib/sounds";

interface ActionCardProps {
  action: string;
  disabled: boolean;
  onAction: (action: string) => void;
  themeKey: 'dogflight' | 'magic' | 'brawling';
  isDisabledByEnemy?: boolean;
}

export function ActionCard({ action, disabled, onAction, themeKey, isDisabledByEnemy }: ActionCardProps) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleClick = () => {
    if (disabled || isDisabledByEnemy) return;
    
    soundPlayer.buttonClick();
    setIsLaunching(true);
    
    setTimeout(() => {
      onAction(action);
      setIsLaunching(false);
    }, 200);
  };

  const handleHover = () => {
    if (!disabled && !isDisabledByEnemy) {
      soundPlayer.buttonHover();
    }
  };
  const themeColors = {
    dogflight: 'from-theme-dogfight-primary to-theme-dogflight-secondary',
    magic: 'from-theme-magic-primary to-theme-magic-secondary',
    brawling: 'from-theme-brawling-primary to-theme-brawling-secondary'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full h-full"
    >
      <Button
        onClick={() => onAction(action)}
        disabled={disabled || isDisabledByEnemy}
        className={cn(
          "w-full h-24 text-lg font-bold relative overflow-hidden group",
          "bg-gradient-to-br shadow-lg",
          !disabled && !isDisabledByEnemy && themeColors[themeKey],
          (disabled || isDisabledByEnemy) && "opacity-40 cursor-not-allowed bg-muted"
        )}
      >
        <span className="relative z-10">{action}</span>
        {!disabled && !isDisabledByEnemy && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        {isDisabledByEnemy && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
            <span className="text-xs font-normal">Sabotaged</span>
          </div>
        )}
      </Button>
    </motion.div>
<!--     <Button
      onClick={handleClick}
      onMouseEnter={handleHover}
      disabled={disabled || isDisabledByEnemy}
      className={cn(
        "h-24 text-lg font-bold relative overflow-hidden group transition-all duration-300",
        "bg-gradient-to-br shadow-lg hover:shadow-2xl",
        !disabled && !isDisabledByEnemy && themeColors[themeKey],
        !disabled && !isDisabledByEnemy && "hover:scale-105 hover:-translate-y-1",
        (disabled || isDisabledByEnemy) && "opacity-40 cursor-not-allowed bg-muted",
        isLaunching && "animate-card-launch"
      )}
    >
      <span className="relative z-10">{action}</span>
<!--       {!disabled && !isDisabledByEnemy && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-colors rounded-lg" />
        </>
      )}
<!--       {isDisabledByEnemy && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
          <span className="text-xs font-normal">Sabotaged</span>
        </div>
      )}
    </Button> -->
  );
}
