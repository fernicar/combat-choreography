import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: [string, string, string, string, string];
  expPlaceholder: string;
}

export function HelpModal({ isOpen, onClose, actions, expPlaceholder }: HelpModalProps) {
  const [act1, act2, act3] = actions;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">How to Play: The Two-Layer System</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            The outcome of every turn is calculated by adding two layers together.
          </p>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">Layer 1: The Base Outcome</h3>
            <p>
              Actions are grouped. <strong>{act1}</strong> and <strong>{act2}</strong> are 'Base Actions'. 
              The others (<strong>{act3}</strong>, etc.) are all considered a generic '<strong>{expPlaceholder}</strong>' 
              action for this layer. An outcome is calculated from this simplified matchup.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-accent">Layer 2: The Expansion Outcome</h3>
            <p>
              If you chose one of the three 'Expansion' actions, a second outcome is calculated from their 
              rock-paper-scissors relationship. If you chose a 'Base Action', this outcome is zero.
            </p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="font-bold text-center">
              Final Result = (Base Outcome) + (Expansion Outcome)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
