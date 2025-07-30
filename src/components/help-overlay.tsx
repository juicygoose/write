import { Button } from "@/components/ui/button";

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
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
        <Button className="w-full mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}