import { useEffect } from "react";

interface KeyboardShortcutsProps {
  showStats: boolean;
  showDocumentsList: boolean;
  isDistractionFree: boolean;
  onSave: () => void;
  onLoad: () => void;
  onToggleStats: () => void;
  onToggleDocumentsList: () => void;
  onToggleDistractionFree: () => void;
}

export function useKeyboardShortcuts({
  showStats,
  showDocumentsList,
  isDistractionFree,
  onSave,
  onLoad,
  onToggleStats,
  onToggleDocumentsList,
  onToggleDistractionFree,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }

      // Cmd/Ctrl + O to load
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        onLoad();
      }

      // Cmd/Ctrl + Shift + S to toggle stats
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
        onToggleStats();
      }

      // Cmd/Ctrl + Shift + D to toggle documents
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        onToggleDocumentsList();
      }

      // Cmd/Ctrl + Shift + F to toggle distraction-free mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        onToggleDistractionFree();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    showStats,
    showDocumentsList,
    isDistractionFree,
    onSave,
    onLoad,
    onToggleStats,
    onToggleDocumentsList,
    onToggleDistractionFree,
  ]);
}