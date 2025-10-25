import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  action: string;
  disabled: boolean;
  onAction: (action: string) => void;
  themeKey: 'dogflight' | 'magic' | 'brawling';
  isDisabledByEnemy?: boolean;
}

export function ActionCard({ action, disabled, onAction, themeKey, isDisabledByEnemy }: ActionCardProps) {
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
  );
}
