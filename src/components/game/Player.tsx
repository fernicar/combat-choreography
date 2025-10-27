import { motion } from 'framer-motion';
import React from 'react';

type PlayerState = 'idle' | 'hit' | 'attacking';

interface PlayerProps {
  isPlayer: boolean;
  state: PlayerState;
  themeKey: 'dogflight' | 'magic' | 'brawling';
}

const characters = {
  dogflight: { player: '✈️', enemy: '💣' },
  magic: { player: '🧙‍♂️', enemy: '🔥' },
  brawling: { player: '🥊', enemy: '💪' },
};

export const Player: React.FC<PlayerProps> = ({ isPlayer, state, themeKey }) => {
  const character = isPlayer ? characters[themeKey].player : characters[themeKey].enemy;

  const variants = {
    idle: { scale: 1, rotate: 0 },
    attacking: { scale: 1.2, y: -20, transition: { yoyo: Infinity, duration: 0.3 } },
    hit: {
      x: [-1, 1, -1, 1, 0],
      opacity: [1, 0.5, 1, 0.5, 1],
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="text-6xl"
      variants={variants}
      animate={state}
    >
      {character}
    </motion.div>
  );
};
