import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { GameConfig } from "@/types/game";

interface GameConfigProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onStartGame: () => void;
  onSetDefaults: () => void;
}

export function GameConfigComponent({ config, onConfigChange, onStartGame, onSetDefaults }: GameConfigProps) {
  const updateConfig = (key: keyof GameConfig, value: number | boolean) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6 bg-card rounded-xl border-2 border-primary/20 animate-slide-up">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Configure New Game
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Number of Enemies</Label>
            <span className="text-sm font-bold text-primary">{config.numEnemies}</span>
          </div>
          <Slider
            value={[config.numEnemies]}
            onValueChange={([value]) => updateConfig('numEnemies', value)}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>First Enemy Advantage</Label>
            <span className="text-sm font-bold text-primary">{config.firstEnemyAdvantage}</span>
          </div>
          <Slider
            value={[config.firstEnemyAdvantage]}
            onValueChange={([value]) => updateConfig('firstEnemyAdvantage', value)}
            min={5}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Enemy Actions to Sabotage</Label>
            <span className="text-sm font-bold text-primary">{config.sabotageCount}</span>
          </div>
          <Slider
            value={[config.sabotageCount]}
            onValueChange={([value]) => updateConfig('sabotageCount', value)}
            min={0}
            max={4}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Delayed Actions (Gambit)</Label>
            <span className="text-sm font-bold text-primary">{config.gambitQueueSize}</span>
          </div>
          <Slider
            value={[config.gambitQueueSize]}
            onValueChange={([value]) => updateConfig('gambitQueueSize', value)}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="debug"
            checked={config.isDebug}
            onCheckedChange={(checked) => updateConfig('isDebug', checked as boolean)}
          />
          <Label htmlFor="debug" className="cursor-pointer">Debug (Show AI Move)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="selfSabotage"
            checked={config.isSelfSabotaged}
            onCheckedChange={(checked) => updateConfig('isSelfSabotaged', checked as boolean)}
          />
          <Label htmlFor="selfSabotage" className="cursor-pointer">Random Self-Sabotage</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onSetDefaults} variant="outline" className="flex-1">
          Default
        </Button>
        <Button onClick={onStartGame} className="flex-1 bg-gradient-to-r from-primary to-accent">
          Play
        </Button>
      </div>
    </div>
  );
}
