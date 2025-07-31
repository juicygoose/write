import { useState, useEffect, useCallback } from "react";

export function useTextSelection(
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>,
) {
  const [selectedText, setSelectedText] = useState<string>("");

  const handleSelectionChange = useCallback(() => {
    // Check if the active element is inside a chat modal
    const activeElement = document.activeElement;
    if (activeElement && activeElement.closest("[data-text-selection-chat]")) {
      return; // Don't update selection if focus is in chat modal
    }

    // Check if selection is within the textarea
    if (textareaRef?.current && activeElement === textareaRef.current) {
      const textarea = textareaRef.current;
      const selected = textarea.value
        .substring(textarea.selectionStart, textarea.selectionEnd)
        .trim();
      setSelectedText(selected || "");
      return;
    }

    // Fallback to regular selection handling
    const sel = window.getSelection();
    const selected = sel?.toString().trim() || "";
    setSelectedText(selected);
  }, [textareaRef]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleSelectionChange);

    // Also listen to textarea-specific events
    const textarea = textareaRef?.current;
    if (textarea) {
      textarea.addEventListener("select", handleSelectionChange);
      textarea.addEventListener("mouseup", handleSelectionChange);
      textarea.addEventListener("keyup", handleSelectionChange);
    }

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);

      if (textarea) {
        textarea.removeEventListener("select", handleSelectionChange);
        textarea.removeEventListener("mouseup", handleSelectionChange);
        textarea.removeEventListener("keyup", handleSelectionChange);
      }
    };
  }, [handleSelectionChange, textareaRef]);

  const clearSelection = useCallback(() => {
    setSelectedText("");
  }, []);

  return { selectedText, clearSelection };
}
