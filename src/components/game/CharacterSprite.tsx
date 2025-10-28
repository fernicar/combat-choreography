// Import idle sprites only
import dogfightPlayerIdle from "@/assets/dogfight_player_idle.png";
import dogfightEnemyIdle from "@/assets/dogfight_enemy_idle.png";
import magicPlayerIdle from "@/assets/magic_player_idle.png";
import magicEnemyIdle from "@/assets/magic_enemy_idle.png";
import brawlingPlayerIdle from "@/assets/brawling_player_idle.png";
import brawlingEnemyIdle from "@/assets/brawling_enemy_idle.png";

interface CharacterSpriteProps {
  themeKey: 'dogflight' | 'magic' | 'brawling';
  isPlayer: boolean;
  state: 'idle' | 'attack' | 'hit' | 'victory' | 'defeat';
  advantage: number;
}

export function CharacterSprite({ themeKey, isPlayer }: CharacterSpriteProps) {
  const spriteMap = {
    dogflight: {
      player: dogfightPlayerIdle,
      enemy: dogfightEnemyIdle,
    },
    magic: {
      player: magicPlayerIdle,
      enemy: magicEnemyIdle,
    },
    brawling: {
      player: brawlingPlayerIdle,
      enemy: brawlingEnemyIdle,
    },
  };

  const sprite = isPlayer ? spriteMap[themeKey].player : spriteMap[themeKey].enemy;

  return (
    <div className="relative flex items-center justify-center h-48">
      <img
        src={sprite}
        alt={isPlayer ? "Player" : "Enemy"}
        className="h-40 w-40 object-contain"
      />
    </div>
  );
}
