import { GameConcept, GameRules } from '@/types/game';

export const gameConcepts: Record<string, GameConcept> = {
  dogfight: {
    title: "Dogfight",
    icon: "✈️",
    defeatMsg: "MISSION FAILED",
    actions: ["Claim to", "Dive Six", "Scissors", "Split-S", "Tight Turn"],
    expPlaceholder: "attacks",
    themeKey: 'dogflight'
  },
  magicduel: {
    title: "Magic Duel",
    icon: "🧙",
    defeatMsg: "VANQUISHED",
    actions: ["Charge", "Counter", "Fry", "Dry", "Wet"],
    expPlaceholder: "spell",
    themeKey: 'magic'
  },
  brawlingmatch: {
    title: "Brawling Match",
    icon: "🥊",
    defeatMsg: "KNOCKED OUT",
    actions: ["Rest", "Fend", "Punch", "Grab", "Kick"],
    expPlaceholder: "strike",
    themeKey: 'brawling'
  }
};

export function buildRules(actionNames: [string, string, string, string, string], expPlaceholder: string): GameRules {
  const [act1, act2, act3, act4, act5] = actionNames;
  
  const baseActions: Record<string, Record<string, [number, number]>> = {
    [act1]: {
      [expPlaceholder]: [-3, -1] as [number, number],
      [act1]: [+1, +1] as [number, number],
      [act2]: [+1, -1] as [number, number]
    },
    [act2]: {
      [expPlaceholder]: [-1, -2] as [number, number],
      [act1]: [-1, +1] as [number, number],
      [act2]: [-1, -1] as [number, number]
    },
    [expPlaceholder]: {
      [expPlaceholder]: [-1, -1] as [number, number],
      [act1]: [-1, -3] as [number, number],
      [act2]: [-2, -1] as [number, number]
    }
  };

  const expansionActions: Record<string, Record<string, [number, number]>> = {
    [act3]: {
      [act4]: [0, -2] as [number, number],
      [act5]: [-2, 0] as [number, number],
      [act3]: [-1, -1] as [number, number]
    },
    [act4]: {
      [act5]: [0, -2] as [number, number],
      [act3]: [-2, 0] as [number, number],
      [act4]: [-1, -1] as [number, number]
    },
    [act5]: {
      [act3]: [0, -2] as [number, number],
      [act4]: [-2, 0] as [number, number],
      [act5]: [-1, -1] as [number, number]
    }
  };

  return { baseActions, expansionActions, expPlaceholder };
}

export function getOutcome(
  playerAction: string,
  cpuAction: string,
  gameRules: GameRules
): [number, number] {
  const { baseActions, expansionActions, expPlaceholder } = gameRules;
  const expansionKeys = Object.keys(expansionActions);

  const playerBaseAction = expansionKeys.includes(playerAction) ? expPlaceholder : playerAction;
  const cpuBaseAction = expansionKeys.includes(cpuAction) ? expPlaceholder : cpuAction;

  const baseOutcome = baseActions[playerBaseAction]?.[cpuBaseAction] || [0, 0];
  let expansionOutcome: [number, number] = [0, 0];

  if (expansionKeys.includes(playerAction) && expansionActions[playerAction]?.[cpuAction]) {
    expansionOutcome = expansionActions[playerAction][cpuAction];
  }

  return [baseOutcome[0] + expansionOutcome[0], baseOutcome[1] + expansionOutcome[1]];
}

export function getRandomConcept(): GameConcept {
  const keys = Object.keys(gameConcepts);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return gameConcepts[randomKey];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
