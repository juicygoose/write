import { useState, useRef } from "react";
import { saveDocument } from "@/lib/actions";
import type { Project } from "@/lib/database";

interface UseDocumentOperationsProps {
  content: string;
  fileName: string;
  currentDocumentId: string | null;
  activeProject: Project | null;
  setLastSaved: (date: Date | null) => void;
  setCurrentDocumentId: (id: string | null) => void;
}

export function useDocumentOperations({
  content,
  fileName,
  currentDocumentId,
  activeProject,
  setLastSaved,
  setCurrentDocumentId,
}: UseDocumentOperationsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveToDatabase = async () => {
    if (!content.trim() || !activeProject) return;

    setIsSaving(true);
    try {
      const document = await saveDocument(
        fileName,
        content,
        activeProject.id,
        currentDocumentId || undefined,
      );

      if (!currentDocumentId) {
        setCurrentDocumentId(document.id);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (
    event: React.ChangeEvent<HTMLInputElement>,
    onLoadComplete: (content: string, fileName: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        onLoadComplete(text, fileName);
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    isSaving,
    fileInputRef,
    saveToDatabase,
    handleExport,
    handleLoad,
    triggerFileInput,
  };
}