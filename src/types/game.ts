export type GameTheme = 'dogfight' | 'magicduel' | 'brawlingmatch';

export interface GameConcept {
  title: string;
  icon: string;
  defeatMsg: string;
  actions: [string, string, string, string, string];
  expPlaceholder: string;
  themeKey: 'dogflight' | 'magic' | 'brawling';
}

export interface GameConfig {
  numEnemies: number;
  firstEnemyAdvantage: number;
  sabotageCount: number;
  gambitQueueSize: number;
  isDebug: boolean;
  isSelfSabotaged: boolean;
  cpuAdvantageLevels?: number[];
}

export interface GameRules {
  baseActions: Record<string, Record<string, [number, number]>>;
  expansionActions: Record<string, Record<string, [number, number]>>;
  expPlaceholder: string;
}

export interface RoundEffect {
  player: boolean;
  enemy: boolean;
}

export type GameState = 'playing' | 'game_over' | 'victory' | 'menu';
