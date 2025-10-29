import { useEffect } from "react";

// Brawling sprites
import brawlingPlayerIdle from "@/assets/brawling_player_idle.png";
import brawlingPlayerAttack from "@/assets/brawling_player_attack.png";
import brawlingPlayerHit from "@/assets/brawling_player_hit.png";
import brawlingPlayerVictory from "@/assets/brawling_player_victory.png";
import brawlingPlayerDefeat from "@/assets/brawling_player_defeat.png";
import brawlingEnemyIdle from "@/assets/brawling_enemy_idle.png";
import brawlingEnemyAttack from "@/assets/brawling_enemy_attack.png";
import brawlingEnemyHit from "@/assets/brawling_enemy_hit.png";
import brawlingEnemyVictory from "@/assets/brawling_enemy_victory.png";
import brawlingEnemyDefeat from "@/assets/brawling_enemy_defeat.png";

// Dogfight sprites
import dogfightPlayerIdle from "@/assets/dogfight_player_idle.png";
import dogfightPlayerAttack from "@/assets/dogfight_player_attack.png";
import dogfightPlayerHit from "@/assets/dogfight_player_hit.png";
import dogfightPlayerVictory from "@/assets/dogfight_player_victory.png";
import dogfightPlayerDefeat from "@/assets/dogfight_player_defeat.png";
import dogfightEnemyIdle from "@/assets/dogfight_enemy_idle.png";
import dogfightEnemyAttack from "@/assets/dogfight_enemy_attack.png";
import dogfightEnemyHit from "@/assets/dogfight_enemy_hit.png";
import dogfightEnemyVictory from "@/assets/dogfight_enemy_victory.png";
import dogfightEnemyDefeat from "@/assets/dogfight_enemy_defeat.png";

// Magic sprites
import magicPlayerIdle from "@/assets/magic_player_idle.png";
import magicPlayerAttack from "@/assets/magic_player_attack.png";
import magicPlayerHit from "@/assets/magic_player_hit.png";
import magicPlayerVictory from "@/assets/magic_player_victory.png";
import magicPlayerDefeat from "@/assets/magic_player_defeat.png";
import magicEnemyIdle from "@/assets/magic_enemy_idle.png";
import magicEnemyAttack from "@/assets/magic_enemy_attack.png";
import magicEnemyHit from "@/assets/magic_enemy_hit.png";
import magicEnemyVictory from "@/assets/magic_enemy_victory.png";
import magicEnemyDefeat from "@/assets/magic_enemy_defeat.png";

interface CharacterSpriteProps {
  themeKey: 'dogflight' | 'magic' | 'brawling';
  isPlayer: boolean;
  state: 'idle' | 'attack' | 'hit' | 'victory' | 'defeat';
  advantage: number;
}

const spriteMap = {
  dogflight: {
    player: {
      idle: dogfightPlayerIdle,
      attack: dogfightPlayerAttack,
      hit: dogfightPlayerHit,
      victory: dogfightPlayerVictory,
      defeat: dogfightPlayerDefeat,
    },
    enemy: {
      idle: dogfightEnemyIdle,
      attack: dogfightEnemyAttack,
      hit: dogfightEnemyHit,
      victory: dogfightEnemyVictory,
      defeat: dogfightEnemyDefeat,
    },
  },
  magic: {
    player: {
      idle: magicPlayerIdle,
      attack: magicPlayerAttack,
      hit: magicPlayerHit,
      victory: magicPlayerVictory,
      defeat: magicPlayerDefeat,
    },
    enemy: {
      idle: magicEnemyIdle,
      attack: magicEnemyAttack,
      hit: magicEnemyHit,
      victory: magicEnemyVictory,
      defeat: magicEnemyDefeat,
    },
  },
  brawling: {
    player: {
      idle: brawlingPlayerIdle,
      attack: brawlingPlayerAttack,
      hit: brawlingPlayerHit,
      victory: brawlingPlayerVictory,
      defeat: brawlingPlayerDefeat,
    },
    enemy: {
      idle: brawlingEnemyIdle,
      attack: brawlingEnemyAttack,
      hit: brawlingEnemyHit,
      victory: brawlingEnemyVictory,
      defeat: brawlingEnemyDefeat,
    },
  },
};

// Preload all images
const preloadImages = () => {
  const allSprites = Object.values(spriteMap).flatMap(theme =>
    Object.values(theme).flatMap(character =>
      Object.values(character)
    )
  );
  
  allSprites.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

export function CharacterSprite({ themeKey, isPlayer, state }: CharacterSpriteProps) {
  useEffect(() => {
    preloadImages();
  }, []);

  const character = isPlayer ? 'player' : 'enemy';
  const sprite = spriteMap[themeKey][character][state];

  return (
    <div className="relative flex items-center justify-center h-48">
      <img
        src={sprite}
        alt={`${isPlayer ? 'Player' : 'Enemy'} - ${state}`}
        className="h-40 w-40 object-contain transition-opacity duration-200"
      />
    </div>
  );
}
