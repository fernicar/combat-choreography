import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdvantageBarProps {
  advantage: number;
  maxAdvantage: number;
  label: string;
  isPlayer: boolean;
  themeKey: 'dogflight' | 'magic' | 'brawling';
  showHitEffect?: boolean;
}

export function AdvantageBar({ 
  advantage, 
  maxAdvantage, 
  label, 
  isPlayer,
  themeKey,
  showHitEffect 
}: AdvantageBarProps) {
  const percentage = Math.max(0, Math.min(100, (advantage / maxAdvantage) * 100));
  
  const themeColors = {
    dogflight: 'bg-theme-dogflight-primary',
    magic: 'bg-theme-magic-primary',
    brawling: 'bg-theme-brawling-primary'
  };

  return (
    <div className={cn("space-y-2", showHitEffect && "animate-shake")}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={cn(
          "text-2xl font-bold tabular-nums",
          advantage <= 3 && "text-destructive animate-pulse-glow",
          advantage > 3 && themeColors[themeKey]
        )}>
          {advantage}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-3",
          showHitEffect && "animate-hit-flash"
        )}
      />
      {showHitEffect && (
        <div className="absolute inset-0 bg-destructive/30 animate-hit-flash rounded-lg pointer-events-none" />
      )}
    </div>
  );
}
