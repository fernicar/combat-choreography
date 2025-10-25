import { cn } from "@/lib/utils";

interface GambitQueueProps {
  queue: string[];
  maxSize: number;
  label: string;
  isPlayer: boolean;
  currentTurn: number;
  themeKey: 'dogflight' | 'magic' | 'brawling';
}

export function GambitQueue({ 
  queue, 
  maxSize, 
  label, 
  isPlayer, 
  currentTurn,
  themeKey 
}: GambitQueueProps) {
  const themeColors = {
    dogflight: 'border-theme-dogflight-primary',
    magic: 'border-theme-magic-primary',
    brawling: 'border-theme-brawling-primary'
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">
        {label}
      </h4>
      <div className="flex gap-2 justify-center">
        {Array.from({ length: maxSize }).map((_, index) => {
          const action = queue[index];
          const isActive = index === currentTurn;
          const isRevealed = isPlayer || currentTurn >= index;
          
          return (
            <div
              key={index}
              className={cn(
                "w-16 h-16 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all",
                "bg-card/50 backdrop-blur-sm",
                isActive && themeColors[themeKey],
                isActive && "scale-110 shadow-lg",
                !isActive && "border-border"
              )}
            >
              {isRevealed ? (action || '?') : '?'}
            </div>
          );
        })}
      </div>
    </div>
  );
}
