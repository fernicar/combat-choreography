import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CombatLogProps {
  history: string[];
  themeKey: 'dogflight' | 'magic' | 'brawling';
}

export function CombatLog({ history, themeKey }: CombatLogProps) {
  const themeColors = {
    dogflight: 'border-theme-dogflight-primary',
    magic: 'border-theme-magic-primary',
    brawling: 'border-theme-brawling-primary'
  };

  return (
    <div className={cn(
      "bg-card/50 backdrop-blur-sm rounded-lg border-2 p-4",
      themeColors[themeKey]
    )}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Combat Log
      </h3>
      <ScrollArea className="h-48">
        <div className="space-y-2 text-sm pr-4">
          {history.map((entry, index) => (
            <div
              key={index}
              className={cn(
                "p-2 rounded animate-slide-up",
                index === history.length - 1 && "bg-secondary/50"
              )}
              dangerouslySetInnerHTML={{ __html: entry }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
