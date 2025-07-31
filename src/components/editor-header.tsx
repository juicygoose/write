import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProjectSelector } from "@/components/project-selector";
import { UserMenu } from "@/components/user-menu";
import type { Project } from "@/lib/database";
import {
  Save,
  Eye,
  EyeOff,
  Download,
  Upload,
  HelpCircle,
  Plus,
  FolderOpen,
  Focus,
  MessageCircle,
} from "lucide-react";

interface EditorHeaderProps {
  activeProject: Project | null;
  onProjectSelect: (project: Project) => void;
  fileName: string;
  setFileName: (name: string) => void;
  lastSaved: Date | null;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  showDocumentsList: boolean;
  setShowDocumentsList: (show: boolean) => void;
  isDistractionFree: boolean;
  setIsDistractionFree: (distraction: boolean) => void;
  showHelp: boolean;
  setShowHelp: (help: boolean) => void;
  onNewDocument: () => void;
  onLoad: () => void;
  onSave: () => void;
  onExport: () => void;
  selectedText?: string;
  onAIChat?: () => void;
}

export function EditorHeader({
  activeProject,
  onProjectSelect,
  fileName,
  setFileName,
  lastSaved,
  showStats,
  setShowStats,
  showDocumentsList,
  setShowDocumentsList,
  isDistractionFree,
  setIsDistractionFree,
  showHelp,
  setShowHelp,
  onNewDocument,
  onLoad,
  onSave,
  onExport,
  selectedText,
  onAIChat,
}: EditorHeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="hidden lg:flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <ProjectSelector
          activeProject={activeProject}
          onProjectSelect={onProjectSelect}
        />
        <div className="h-6 w-px bg-border" />
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="text-lg font-medium bg-transparent border-none outline-none focus:underline max-w-xs"
        />
        {lastSaved && (
          <span className="text-sm text-muted-foreground">
            Saved at {formatTime(lastSaved)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <UserMenu />
        <ThemeToggle />

        {selectedText && onAIChat && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAIChat}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            <MessageCircle className="h-4 w-4" />
            Ask AI
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onNewDocument}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDocumentsList(!showDocumentsList)}
          className="flex items-center gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          Documents
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2"
        >
          {showStats ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          Stats
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLoad}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Load
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDistractionFree(!isDistractionFree)}
          className="flex items-center gap-2"
        >
          <Focus className="h-4 w-4" />
          Focus
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}