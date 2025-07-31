import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Save document</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl+S</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Load document</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl+O</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toggle statistics</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm">
              Ctrl+Shift+S
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toggle documents</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm">
              Ctrl+Shift+D
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toggle fullscreen</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm">F11</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Focus mode</span>
            <kbd className="px-2 py-1 bg-muted rounded text-sm">
              Ctrl+Shift+F
            </kbd>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Features</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Auto-save every 5 seconds</li>
            <li>• Real-time word count and reading time</li>
            <li>• Daily writing goal tracking</li>
            <li>• Distraction-free writing environment</li>
            <li>• Dark/light theme support</li>
          </ul>
        </div>
        
        <DialogFooter>
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}