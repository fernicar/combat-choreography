import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/game/ActionCard";
import { AdvantageBar } from "@/components/game/AdvantageBar";
import { CombatLog } from "@/components/game/CombatLog";
import { GambitQueue } from "@/components/game/GambitQueue";
import { HelpModal } from "@/components/game/HelpModal";
import { Player } from "@/components/game/Player";
import { GameConfigComponent } from "@/components/game/GameConfig";
import { CharacterSprite } from "@/components/game/CharacterSprite";
import { GameConfig, GameState, RoundEffect, GameConcept, GameRules } from "@/types/game";
import { playSound } from "@/lib/audio";
import { buildRules, getOutcome, getRandomConcept, shuffleArray } from "@/lib/gameLogic";
import { motion } from 'framer-motion';
import { Settings, HelpCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { playActionSound, soundPlayer } from "@/lib/sounds";

// Import backgrounds
import bgDogfight from "@/assets/bg-dogfight.png";
import bgMagic from "@/assets/bg-magic.png";
import bgBrawling from "@/assets/bg-brawling.png";

const defaultConfig: GameConfig = {
  numEnemies: 4,
  firstEnemyAdvantage: 7,
  sabotageCount: 0,
  gambitQueueSize: 1,
  isDebug: false,
  isSelfSabotaged: false,
};

const Index = () => {
  const [appState, setAppState] = useState<'menu' | 'game'>('menu');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [concept, setConcept] = useState<GameConcept | null>(null);
  const [gameRules, setGameRules] = useState<GameRules | null>(null);
  
  const [playerAdvantage, setPlayerAdvantage] = useState(10);
  const [cpuAdvantage, setCpuAdvantage] = useState(7);
  const [currentCpuIndex, setCurrentCpuIndex] = useState(0);
  
  const [playerQueue, setPlayerQueue] = useState<string[]>([]);
  const [cpuQueue, setCpuQueue] = useState<string[]>([]);
  const [currentGambitTurn, setCurrentGambitTurn] = useState(-1);
  
  const [historyLog, setHistoryLog] = useState<string[]>([]);
  const [roundEffect, setRoundEffect] = useState<RoundEffect | null>(null);
  
  const [playerDisabledAction, setPlayerDisabledAction] = useState<string | null>(null);
  const [enemyDisabledActions, setEnemyDisabledActions] = useState<string[]>([]);
  const [aiNextMove, setAiNextMove] = useState<string>("");
  
  const [showHelp, setShowHelp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [playerSpriteState, setPlayerSpriteState] = useState<'idle' | 'attack' | 'hit' | 'victory' | 'defeat'>('idle');
  const [enemySpriteState, setEnemySpriteState] = useState<'idle' | 'attack' | 'hit' | 'victory' | 'defeat'>('idle');

  const [playerState, setPlayerState] = useState<'idle' | 'hit' | 'attacking'>('idle');
  const [enemyState, setEnemyState] = useState<'idle' | 'hit' | 'attacking'>('idle');
  const [isShaking, setIsShaking] = useState(false);

  const initializeGame = () => {
    playSound('game-start');
    const newConcept = getRandomConcept();
    setConcept(newConcept);
    setGameRules(buildRules(newConcept.actions, newConcept.expPlaceholder));
    
    setPlayerAdvantage(10);
    setCurrentCpuIndex(0);
    
    const cpuLevels = Array.from(
      { length: config.numEnemies },
      (_, i) => config.firstEnemyAdvantage + (i * 3)
    );
    setCpuAdvantage(cpuLevels[0]);
    setConfig({ ...config, cpuAdvantageLevels: cpuLevels });
    
    setGameState('playing');
    setHistoryLog(["The engagement begins. Choose your action."]);
    
    setPlayerDisabledAction(
      config.isSelfSabotaged ? newConcept.actions[Math.floor(Math.random() * 5)] : null
    );
    
    const shuffled = shuffleArray([...newConcept.actions]);
    setEnemyDisabledActions(shuffled.slice(0, config.sabotageCount));
    
    setPlayerQueue([]);
    setCpuQueue([]);
    setCurrentGambitTurn(-1);
    setRoundEffect(null);
    
    setAppState('game');
    
    if (config.isDebug) {
      prepareNextAiMove(newConcept, shuffled.slice(0, config.sabotageCount));
    }
  };

  const getAiMove = (currentConcept: GameConcept, disabledActions: string[]): string => {
    if (!gameRules) return currentConcept.actions[0];
    
    const availableActions = currentConcept.actions.filter(a => !disabledActions.includes(a));
    const expansionActions = Object.keys(gameRules.expansionActions);
    const availableExpansion = availableActions.filter(a => expansionActions.includes(a));
    const availableBase = availableActions.filter(a => !expansionActions.includes(a));
    
    const isExpansionRoll = Math.random() < (availableExpansion.length / availableActions.length);
    
    if (isExpansionRoll && availableExpansion.length > 0) {
      return availableExpansion[Math.floor(Math.random() * availableExpansion.length)];
    } else if (availableBase.length > 0) {
      const filtered = availableBase.filter(a => a !== gameRules.expPlaceholder);
      return filtered.length > 0 
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : availableExpansion[Math.floor(Math.random() * availableExpansion.length)];
    }
    
    return availableActions[0];
  };

  const prepareNextAiMove = (currentConcept: GameConcept, disabledActions: string[]) => {
    setAiNextMove(getAiMove(currentConcept, disabledActions));
  };

  const processTurn = (playerAction: string, cpuAction: string) => {
    if (!gameRules || !concept || !playerAction || !cpuAction) return;
    
    // Play action sounds
    playActionSound(playerAction, concept.themeKey);
    setTimeout(() => playActionSound(cpuAction, concept.themeKey), 200);
    

    setRoundEffect({ player: playerChange < 0, enemy: cpuChange < 0 });
    setTimeout(() => setRoundEffect(null), 500);

    setPlayerState(playerChange < 0 ? 'hit' : 'idle');
    setEnemyState(cpuChange < 0 ? 'hit' : 'idle');

    if (playerChange < 0 || cpuChange < 0) {
      playSound('hit');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }

    setTimeout(() => {
      setPlayerState('idle');
      setEnemyState('idle');
    }, 500);

<!--     // Animate sprites
    setPlayerSpriteState('attack');
    setTimeout(() => setEnemySpriteState('attack'), 200); -->

    
    setTimeout(() => {
      const outcome = getOutcome(playerAction, cpuAction, gameRules);
      const [playerChange, cpuChange] = outcome;
      
      const newPlayerAdv = playerAdvantage + playerChange;
      const newCpuAdv = cpuAdvantage + cpuChange;
      
      // Hit reactions
      if (playerChange < 0) {
        setPlayerSpriteState('hit');
        soundPlayer.hitImpact(playerChange);
      }
      if (cpuChange < 0) {
        setEnemySpriteState('hit');
        soundPlayer.hitImpact(cpuChange);
      }
      
      setPlayerAdvantage(newPlayerAdv);
      setCpuAdvantage(newCpuAdv);
      
      setRoundEffect({ player: playerChange < 0, enemy: cpuChange < 0 });
      setTimeout(() => setRoundEffect(null), 500);
      
      const pAdvStr = `${playerChange >= 0 ? '+' : ''}${playerChange}`;
      const cAdvStr = `${cpuChange >= 0 ? '+' : ''}${cpuChange}`;
      
      const roundSummary = `You: ${playerAction} | Enemy: ${cpuAction}<br>
        Player: ${playerAdvantage}→${newPlayerAdv} (${pAdvStr}) | 
        Enemy: ${cpuAdvantage}→${newCpuAdv} (${cAdvStr})`;
      
      setHistoryLog(prev => [...prev, roundSummary]);
    }, 400);
  };

  const checkWinLoss = () => {
    if (cpuAdvantage <= 0 && playerAdvantage > 0) {
      setEnemySpriteState('defeat');
      soundPlayer.enemyDefeated();
      
      if (config.numEnemies === 1 || currentCpuIndex >= config.numEnemies - 1) {
        setGameState('victory');

<!--         playSound('victory'); -->

        setPlayerSpriteState('victory');
        soundPlayer.victory();

        toast.success("Victory!", { description: "You've defeated all enemies!" });
        return true;
      } else {
        setTimeout(() => {
          setPlayerSpriteState('idle');
          setEnemySpriteState('idle');
          nextEnemy();
        }, 800);
        return true;
      }
    } else if (playerAdvantage <= 0 || (cpuAdvantage <= 0 && playerAdvantage <= 0)) {
      setGameState('game_over');
      setPlayerSpriteState('defeat');
      soundPlayer.defeat();
      
      if (cpuAdvantage <= 0 && playerAdvantage <= 0) {
        setEnemySpriteState('defeat');
        setHistoryLog(prev => [...prev, "<b>Mutual destruction.</b>"]);
        toast.error("Draw", { description: "Mutual destruction!" });
      } else {
        setHistoryLog(prev => [...prev, "<b>You were defeated.</b>"]);
        playSound('defeat');
        toast.error(concept?.defeatMsg || "Defeated!");
      }
      return true;
    }
    
    if (config.isDebug && gameState === 'playing' && concept) {
      prepareNextAiMove(concept, enemyDisabledActions);
    }
    
    return false;
  };

  const nextEnemy = () => {
    if (!concept || !config.cpuAdvantageLevels) return;
    
    setHistoryLog(prev => [...prev, `<b>--- Opponent #${currentCpuIndex + 1} Defeated! ---</b>`]);
    
    const nextIndex = currentCpuIndex + 1;
    setCurrentCpuIndex(nextIndex);
    setPlayerAdvantage(10);
    setCpuAdvantage(config.cpuAdvantageLevels[nextIndex]);
    
    setHistoryLog(prev => [...prev, `Opponent #${nextIndex + 1} appears.`]);
    
    const shuffled = shuffleArray([...concept.actions]);
    setEnemyDisabledActions(shuffled.slice(0, config.sabotageCount));
    
    if (config.isDebug) {
      prepareNextAiMove(concept, shuffled.slice(0, config.sabotageCount));
    }
    
    toast.info("Next opponent!", { description: `Facing opponent #${nextIndex + 1}` });
  };

  const resolveGambit = async () => {
    if (!concept) return;
    
    setIsProcessing(true);
    
    for (let i = 0; i < config.gambitQueueSize; i++) {
      setCurrentGambitTurn(i);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (gameState !== 'playing') break;
      
      processTurn(playerQueue[i], cpuQueue[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (checkWinLoss()) break;
    }
    
    setCurrentGambitTurn(-1);
    setPlayerQueue([]);
    setCpuQueue([]);
    setIsProcessing(false);
  };

  const playRound = (playerAction: string) => {
    if (gameState !== 'playing' || isProcessing || !concept) return;

    playSound('action');
    setPlayerState('attacking');
    setEnemyState('attacking');
    
    if (config.gambitQueueSize > 1) {
      if (playerQueue.length < config.gambitQueueSize) {
        setPlayerQueue(prev => [...prev, playerAction]);
        setCpuQueue(prev => [...prev, config.isDebug ? aiNextMove : getAiMove(concept, enemyDisabledActions)]);
        
        if (playerQueue.length === config.gambitQueueSize - 1) {
          setTimeout(resolveGambit, 100);
        }
      }
      return;
    }
    
    const cpuAction = config.isDebug ? aiNextMove : getAiMove(concept, enemyDisabledActions);

    setTimeout(() => {
      processTurn(playerAction, cpuAction);
      setTimeout(checkWinLoss, 500);
    }, 750);
  };

  if (appState === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
        <GameConfigComponent
          config={config}
          onConfigChange={setConfig}
          onStartGame={initializeGame}
          onSetDefaults={() => setConfig(defaultConfig)}
        />
      </div>
    );
  }

  if (!concept || !gameRules) return null;

  const themeKey = concept.themeKey;
  
  const backgrounds = {
    dogflight: bgDogfight,
    magic: bgMagic,
    brawling: bgBrawling,
  };

  const shakeVariants = {
    shaking: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.3 }
    },
    idle: { x: 0 }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4"
      variants={shakeVariants}
      animate={isShaking ? "shaking" : "idle"}
    >
      <div className="max-w-6xl mx-auto space-y-6">

<!--     <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url(${backgrounds[themeKey]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="max-w-6xl mx-auto space-y-6 relative z-10"> -->
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {concept.icon} {concept.title}
          </h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowHelp(true)} size="icon" variant="outline">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button onClick={() => setAppState('menu')} size="icon" variant="outline">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Combat Info */}
          <div className="space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border-2 border-destructive/20 p-4">
              <AdvantageBar
                advantage={cpuAdvantage}
                maxAdvantage={config.firstEnemyAdvantage + (currentCpuIndex * 3)}
                label={`Enemy ${currentCpuIndex + 1}/${config.numEnemies}`}
                isPlayer={false}
                themeKey={themeKey}
                showHitEffect={roundEffect?.enemy}
              />
              {config.isDebug && gameState === 'playing' && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI will use: <span className="text-accent font-bold">{aiNextMove}</span>
                </p>
              )}
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-lg border-2 border-success/20 p-4">
              <AdvantageBar
                advantage={playerAdvantage}
                maxAdvantage={10}
                label="Player"
                isPlayer={true}
                themeKey={themeKey}
                showHitEffect={roundEffect?.player}
              />
            </div>

            {config.gambitQueueSize > 1 && (
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border-2 border-primary/20 p-4 space-y-4">
                <GambitQueue
                  queue={cpuQueue}
                  maxSize={config.gambitQueueSize}
                  label="Enemy Gambit"
                  isPlayer={false}
                  currentTurn={currentGambitTurn}
                  themeKey={themeKey}
                />
                <GambitQueue
                  queue={playerQueue}
                  maxSize={config.gambitQueueSize}
                  label="Your Gambit"
                  isPlayer={true}
                  currentTurn={currentGambitTurn}
                  themeKey={themeKey}
                />
              </div>
            )}
          </div>

          {/* Center Column - Actions & Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-around items-center p-4">
              <Player isPlayer={true} state={playerState} themeKey={themeKey as 'dogflight' | 'magic' | 'brawling'} />
              <Player isPlayer={false} state={enemyState} themeKey={themeKey as 'dogflight' | 'magic' | 'brawling'} />
<!--             {/* Character Sprites */}
            <div className="bg-card/30 backdrop-blur-md rounded-lg border-2 border-primary/20 p-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <CharacterSprite
                    themeKey={themeKey}
                    isPlayer={true}
                    state={playerSpriteState}
                    advantage={playerAdvantage}
                  />
                  <p className="text-sm font-semibold mt-2 text-success">PLAYER</p>
                </div>
                <div className="text-center">
                  <CharacterSprite
                    themeKey={themeKey}
                    isPlayer={false}
                    state={enemySpriteState}
                    advantage={cpuAdvantage}
                  />
                  <p className="text-sm font-semibold mt-2 text-destructive">ENEMY {currentCpuIndex + 1}</p>
                </div>
              </div> -->
            </div>

            <CombatLog history={historyLog} themeKey={themeKey} />

            {gameState === 'playing' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {concept.actions.map((action) => (
                  <ActionCard
                    key={action}
                    action={action}
                    disabled={isProcessing}
                    onAction={playRound}
                    themeKey={themeKey}
                    isDisabledByEnemy={
                      action === playerDisabledAction || enemyDisabledActions.includes(action)
                    }
                  />
                ))}
              </div>
            )}

            {(gameState === 'victory' || gameState === 'game_over') && (
              <div className="text-center space-y-6 py-12">
                <h2 className={`text-6xl font-bold ${
                  gameState === 'victory' 
                    ? 'text-success animate-pulse-glow' 
                    : 'text-destructive'
                }`}>
                  {gameState === 'victory' 
                    ? (config.numEnemies === 1 ? `FINAL SCORE: ${playerAdvantage}` : 'VICTORY!') 
                    : concept.defeatMsg
                  }
                </h2>
                <Button 
                  onClick={initializeGame}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Restart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        actions={concept.actions}
        expPlaceholder={concept.expPlaceholder}
      />
    </motion.div>
  );
};

export default Index;
