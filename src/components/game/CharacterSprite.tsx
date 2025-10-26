import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Import sprites
import dogfightPlayer from "@/assets/dogfight-player.png";
import dogfightEnemy from "@/assets/dogfight-enemy.png";
import magicPlayer from "@/assets/magic-player.png";
import magicEnemy from "@/assets/magic-enemy.png";
import brawlingPlayer from "@/assets/brawling-player.png";
import brawlingEnemy from "@/assets/brawling-enemy.png";

interface CharacterSpriteProps {
  themeKey: 'dogflight' | 'magic' | 'brawling';
  isPlayer: boolean;
  state: 'idle' | 'attack' | 'hit' | 'victory' | 'defeat';
  advantage: number;
}

export function CharacterSprite({ themeKey, isPlayer, state, advantage }: CharacterSpriteProps) {
  const [currentState, setCurrentState] = useState<'idle' | 'attack' | 'hit' | 'victory' | 'defeat'>('idle');

  useEffect(() => {
    setCurrentState(state);
    if (state === 'attack' || state === 'hit') {
      const timer = setTimeout(() => setCurrentState('idle'), 500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const sprites = {
    dogflight: { player: dogfightPlayer, enemy: dogfightEnemy },
    magic: { player: magicPlayer, enemy: magicEnemy },
    brawling: { player: brawlingPlayer, enemy: brawlingEnemy },
  };

  const sprite = isPlayer ? sprites[themeKey].player : sprites[themeKey].enemy;
  const isCritical = advantage <= 3;

  return (
    <div className="relative flex items-center justify-center h-48">
      <img
        src={sprite}
        alt={isPlayer ? "Player" : "Enemy"}
        className={cn(
          "h-40 w-40 object-contain transition-all duration-300",
          currentState === 'idle' && "animate-pulse-slow",
          currentState === 'attack' && "animate-attack-lunge",
          currentState === 'hit' && "animate-hit-recoil",
          currentState === 'victory' && "animate-bounce",
          currentState === 'defeat' && "animate-fade-out opacity-0",
          isCritical && "animate-shake-subtle",
          !isPlayer && "scale-x-[-1]" // Flip enemy to face player
        )}
      />
      {currentState === 'attack' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/30 rounded-full animate-ping" />
        </div>
      )}
      {currentState === 'hit' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-destructive/40 rounded-full animate-hit-flash" />
        </div>
      )}
    </div>
  );
}
