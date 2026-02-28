import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/game/ActionCard";
import { AdvantageBar } from "@/components/game/AdvantageBar";
import { CombatLog } from "@/components/game/CombatLog";
import { GambitQueue } from "@/components/game/GambitQueue";
import { HelpModal } from "@/components/game/HelpModal";
import { GameConfigComponent } from "@/components/game/GameConfig";
import { CharacterSprite } from "@/components/game/CharacterSprite";
import { GameConfig, GameState, RoundEffect, GameConcept, GameRules } from "@/types/game";
import { playSound } from "@/lib/audio";
import { buildRules, getOutcome, gameConcepts, getRandomConcept, shuffleArray } from "@/lib/gameLogic";
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
  theme: 'dogfight',
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
  
  const [playerActionState, setPlayerActionState] = useState<'idle' | 'attack' | 'victory' | 'defeat'>('idle');
  const [enemyActionState, setEnemyActionState] = useState<'idle' | 'attack' | 'victory' | 'defeat'>('idle');
  const [playerIsHit, setPlayerIsHit] = useState(false);
  const [enemyIsHit, setEnemyIsHit] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const prepareNextAiMove = useCallback((currentConcept: GameConcept, disabledActions: string[]) => {
    if (!gameRules) return;
    const availableActions = currentConcept.actions.filter(a => !disabledActions.includes(a));
    const expansionActions = Object.keys(gameRules.expansionActions);
    const availableExpansion = availableActions.filter(a => expansionActions.includes(a));
    const availableBase = availableActions.filter(a => !expansionActions.includes(a));
    
    const isExpansionRoll = Math.random() < (availableExpansion.length / availableActions.length);
    
    let move: string;
    if (isExpansionRoll && availableExpansion.length > 0) {
      move = availableExpansion[Math.floor(Math.random() * availableExpansion.length)];
    } else if (availableBase.length > 0) {
      const filtered = availableBase.filter(a => a !== gameRules.expPlaceholder);
      move = filtered.length > 0 
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : availableExpansion[Math.floor(Math.random() * availableExpansion.length)];
    } else {
      move = availableActions[0];
    }
    setAiNextMove(move);
  }, [gameRules]);

  const nextEnemy = useCallback(() => {
    if (!concept || !config.cpuAdvantageLevels) return;
    
    setHistoryLog(prev => [...prev, `<b>--- Opponent #${currentCpuIndex + 1} Defeated! ---</b>`]);
    
    const nextIndex = currentCpuIndex + 1;
    setCurrentCpuIndex(nextIndex);
    setPlayerAdvantage(10);
    setCpuAdvantage(config.cpuAdvantageLevels[nextIndex]);
    
    setHistoryLog(prev => [...prev, `Opponent #${nextIndex + 1} appears.`]);
    
    const shuffled = shuffleArray([...concept.actions]);
    const disabled = shuffled.slice(0, config.sabotageCount);
    setEnemyDisabledActions(disabled);
    
    setPlayerIsHit(false);
    setEnemyIsHit(false);
    setPlayerActionState('idle');
    setEnemyActionState('idle');

    if (config.isDebug) {
      prepareNextAiMove(concept, disabled);
    }
    
    toast.info("Next opponent!", { description: `Facing opponent #${nextIndex + 1}` });
  }, [concept, config, currentCpuIndex, prepareNextAiMove]);

  const checkWinLoss = useCallback((pAdv: number, cAdv: number): boolean => {
    const playerDefeated = pAdv <= 0;
    const enemyDefeated = cAdv <= 0;

    if (playerDefeated || enemyDefeated) {
      if (playerDefeated && enemyDefeated) {
        setPlayerActionState('defeat');
        setEnemyActionState('defeat');
        setHistoryLog(prev => [...prev, "<b>Mutual destruction.</b>"]);
        toast.error("Draw", { description: "Mutual destruction!" });
      } else if (playerDefeated) {
        setPlayerActionState('defeat');
        setEnemyActionState('victory');
        setHistoryLog(prev => [...prev, "<b>You were defeated.</b>"]);
        toast.error(concept?.defeatMsg || "Defeated!");
      } else {
        setPlayerActionState('victory');
        setEnemyActionState('defeat');
        if (config.numEnemies === 1 || currentCpuIndex >= config.numEnemies - 1) {
          setGameState('victory');
          toast.success("Victory!", { description: "You've defeated all enemies!" });
        } else {
          setTimeout(nextEnemy, 1500);
        }
      }
      
      if(playerDefeated) {
        setGameState('game_over');
        soundPlayer.defeat();
      } else {
        soundPlayer.enemyDefeated();
        if (currentCpuIndex >= config.numEnemies - 1) {
          soundPlayer.victory();
        }
      }
      return true;
    }
    return false;
  }, [concept, config.numEnemies, currentCpuIndex, nextEnemy]);

  const initializeGame = useCallback(() => {
    playSound('game-start');
    const newConcept = gameConcepts[config.theme];
    const newRules = buildRules(newConcept.actions, newConcept.expPlaceholder);
    setConcept(newConcept);
    setGameRules(newRules);
    
    setPlayerAdvantage(10);
    setCurrentCpuIndex(0);
    
    const cpuLevels = Array.from(
      { length: config.numEnemies },
      (_, i) => config.firstEnemyAdvantage + (i * 3)
    );
    setCpuAdvantage(cpuLevels[0]);
    setConfig(prev => ({ ...prev, cpuAdvantageLevels: cpuLevels }));
    
    setGameState('playing');
    setHistoryLog(["The engagement begins. Choose your action."]);
    
    setPlayerDisabledAction(
      config.isSelfSabotaged ? newConcept.actions[Math.floor(Math.random() * 5)] : null
    );
    
    const shuffled = shuffleArray([...newConcept.actions]);
    const disabled = shuffled.slice(0, config.sabotageCount);
    setEnemyDisabledActions(disabled);
    
    setPlayerQueue([]);
    setCpuQueue([]);
    setCurrentGambitTurn(-1);
    setRoundEffect(null);
    setPlayerIsHit(false);
    setEnemyIsHit(false);
    setPlayerActionState('idle');
    setEnemyActionState('idle');
    
    setAppState('game');
    
    if (config.isDebug) {
      prepareNextAiMove(newConcept, disabled);
    }
  }, [config, prepareNextAiMove]);

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
    } else {
        return availableActions[0];
    }
  };

  const processTurn = useCallback(async (playerAction: string, cpuAction: string, basePlayerAdv?: number, baseCpuAdv?: number): Promise<[boolean, number, number]> => {
    if (!gameRules || !concept) {
      return [false, playerAdvantage, cpuAdvantage];
    }

    const [pDelta, cDelta] = getOutcome(playerAction, cpuAction, gameRules);
    const startingPlayerAdv = basePlayerAdv ?? playerAdvantage;
    const startingCpuAdv = baseCpuAdv ?? cpuAdvantage;
    const newPlayerAdv = startingPlayerAdv + pDelta;
    const newCpuAdv = startingCpuAdv + cDelta;

    const playerAttacks = cDelta <= -2;
    const enemyAttacks = pDelta <= -2;
    const playerGetsHit = pDelta <= -2;
    const enemyGetsHit = cDelta <= -2;

    // Animation Timeline
    if (playerAttacks) {
      setPlayerActionState('attack');
      playActionSound(playerAction, concept.themeKey);
    }
    await delay(playerAttacks && enemyAttacks ? 300 : 0); // Stagger if both attack

    if (enemyAttacks) {
      setEnemyActionState('attack');
      playActionSound(cpuAction, concept.themeKey);
    }
    await delay(600); // Attack animation duration

    // Reset attack states
    if (playerAttacks) setPlayerActionState('idle');
    if (enemyAttacks) setEnemyActionState('idle');

    // Update advantages and log
    setPlayerAdvantage(newPlayerAdv);
    setCpuAdvantage(newCpuAdv);
    const pAdvStr = `${pDelta >= 0 ? '+' : ''}${pDelta}`;
    const cAdvStr = `${cDelta >= 0 ? '+' : ''}${cDelta}`;
    const roundSummary = `You: ${playerAction} | Enemy: ${cpuAction}<br>Player: ${startingPlayerAdv}→${newPlayerAdv} (${pAdvStr}) | Enemy: ${startingCpuAdv}→${newCpuAdv} (${cAdvStr})`;
    setHistoryLog(prev => [...prev, roundSummary]);

    // Show hit animations if not defeated
    if (enemyGetsHit && newCpuAdv > 0) {
      setEnemyIsHit(true);
      soundPlayer.hitImpact(cDelta);
    }
    await delay(enemyGetsHit && playerGetsHit ? 300 : 0); // Stagger hits

    if (playerGetsHit && newPlayerAdv > 0) {
      setPlayerIsHit(true);
      soundPlayer.hitImpact(pDelta);
    }
    
    setRoundEffect({ player: playerGetsHit && newPlayerAdv > 0, enemy: enemyGetsHit && newCpuAdv > 0 });
    await delay(400);
    setRoundEffect(null);

    const isGameOver = checkWinLoss(newPlayerAdv, newCpuAdv);
    if (!isGameOver && config.isDebug) {
      prepareNextAiMove(concept, enemyDisabledActions);
    }
    
    return [isGameOver, newPlayerAdv, newCpuAdv];
  }, [concept, gameRules, playerAdvantage, cpuAdvantage, config.isDebug, enemyDisabledActions, checkWinLoss, prepareNextAiMove]);

  const resolveGambit = useCallback(async (pQueueArg?: string[], cQueueArg?: string[]) => {
    if (!concept) return;
    
    setIsProcessing(true);

    const pQueue = pQueueArg ?? [...playerQueue];
    const cQueue = cQueueArg ?? [...cpuQueue];
    const turns = Math.min(config.gambitQueueSize, pQueue.length, cQueue.length);

    let currentPAdv = playerAdvantage;
    let currentCAdv = cpuAdvantage;

    for (let i = 0; i < turns; i++) {
      setCurrentGambitTurn(i);
      setPlayerIsHit(false);
      setEnemyIsHit(false);
      setPlayerActionState('idle');
      setEnemyActionState('idle');
      
      await delay(250);

      const pAction = pQueue[i];
      const cAction = cQueue[i];
      if (!pAction || !cAction) continue;

      const [isGameOver, newPAdv, newCAdv] = await processTurn(pAction, cAction, currentPAdv, currentCAdv);
      
      currentPAdv = newPAdv;
      currentCAdv = newCAdv;

      await delay(1000);
      
      if (isGameOver) break;
    }

    setCurrentGambitTurn(-1);
    setPlayerQueue([]);
    setCpuQueue([]);
    setIsProcessing(false);
  }, [concept, config.gambitQueueSize, playerAdvantage, cpuAdvantage, playerQueue, cpuQueue, processTurn]);

  const playRound = useCallback(async (playerAction: string) => {
    if (gameState !== 'playing' || isProcessing || !concept) return;

    setIsProcessing(true);
    setPlayerIsHit(false);
    setEnemyIsHit(false);
    setPlayerActionState('idle');
    setEnemyActionState('idle');

    await delay(100); // Brief pause to show reset

    if (config.gambitQueueSize > 1) {
      const cpuActionNext = config.isDebug ? aiNextMove : getAiMove(concept, enemyDisabledActions);
      const nextPlayerQueue = [...playerQueue, playerAction];
      const nextCpuQueue = [...cpuQueue, cpuActionNext];

      setPlayerQueue(nextPlayerQueue);
      setCpuQueue(nextCpuQueue);

      if (nextPlayerQueue.length === config.gambitQueueSize) {
        await resolveGambit(nextPlayerQueue, nextCpuQueue);
      } else {
        if (config.isDebug) {
          prepareNextAiMove(concept, enemyDisabledActions);
        }
      }
    } else {
      const cpuAction = config.isDebug ? aiNextMove : getAiMove(concept, enemyDisabledActions);
      await processTurn(playerAction, cpuAction);
    }
    
    setIsProcessing(false);
  }, [gameState, isProcessing, concept, config, playerQueue, cpuQueue, aiNextMove, enemyDisabledActions, resolveGambit, processTurn, prepareNextAiMove]);

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
  const backgrounds = { dogfight: bgDogfight, magic: bgMagic, brawling: bgBrawling };

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url(${backgrounds[themeKey]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            {concept.icon} <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">{concept.title}</span>
          </h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowHelp(true)} size="icon" variant="outline">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button onClick={initializeGame} size="icon" variant="outline">
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button onClick={() => setAppState('menu')} size="icon" variant="outline">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border-2 border-destructive/20 p-4">
              <AdvantageBar
                advantage={cpuAdvantage}
                maxAdvantage={config.cpuAdvantageLevels ? config.cpuAdvantageLevels[currentCpuIndex] : config.firstEnemyAdvantage}
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

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/30 backdrop-blur-md rounded-lg border-2 border-primary/20 p-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <CharacterSprite
                    themeKey={themeKey}
                    isPlayer={true}
                    actionState={playerActionState}
                    isHit={playerIsHit}
                  />
                  <p className="text-sm font-semibold mt-2 text-success">PLAYER</p>
                </div>
                <div className="text-center">
                  <CharacterSprite
                    themeKey={themeKey}
                    isPlayer={false}
                    actionState={enemyActionState}
                    isHit={enemyIsHit}
                  />
                  <p className="text-sm font-semibold mt-2 text-destructive">ENEMY {currentCpuIndex + 1}</p>
                </div>
              </div>
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
                    ? (config.numEnemies > 1 ? 'VICTORY!' : `FINAL SCORE: ${playerAdvantage}`)
                    : (concept?.defeatMsg || 'DEFEATED')
                  }
                </h2>
                <Button 
                  onClick={initializeGame}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
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
    </div>
  );
};

export default Index;
