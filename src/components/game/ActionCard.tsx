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
    <Button
      onClick={() => onAction(action)}
      disabled={disabled || isDisabledByEnemy}
      className={cn(
        "h-24 text-lg font-bold relative overflow-hidden group transition-all duration-300",
        "bg-gradient-to-br shadow-lg hover:shadow-2xl",
        !disabled && !isDisabledByEnemy && themeColors[themeKey],
        !disabled && !isDisabledByEnemy && "hover:scale-105 hover:-translate-y-1",
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
  );
}
