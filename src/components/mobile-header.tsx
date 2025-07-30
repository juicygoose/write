import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import type { Project } from "@/lib/database";
import { FileText, FolderOpen } from "lucide-react";

interface MobileHeaderProps {
  activeProject: Project | null;
  onProjectSelect: (project: Project) => void;
  fileName: string;
  setFileName: (name: string) => void;
  showStats: boolean;
  showDocumentsList: boolean;
  onToggleStats: () => void;
  onToggleDocuments: () => void;
  onNewDocument: () => void;
  onLoad: () => void;
  onSave: () => void;
  onExport: () => void;
  onToggleFocus: () => void;
  onShowHelp: () => void;
  onShowMobileStats: () => void;
  onShowMobileDocuments: () => void;
}

export function MobileHeader({
  activeProject,
  onProjectSelect,
  fileName,
  setFileName,
  showStats,
  showDocumentsList,
  onToggleStats,
  onToggleDocuments,
  onNewDocument,
  onLoad,
  onSave,
  onExport,
  onToggleFocus,
  onShowHelp,
  onShowMobileStats,
  onShowMobileDocuments,
}: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <MobileMenu
          activeProject={activeProject}
          onProjectSelect={onProjectSelect}
          showStats={showStats}
          showDocumentsList={showDocumentsList}
          onToggleStats={onToggleStats}
          onToggleDocuments={onToggleDocuments}
          onNewDocument={onNewDocument}
          onLoad={onLoad}
          onSave={onSave}
          onExport={onExport}
          onToggleFocus={onToggleFocus}
          onShowHelp={onShowHelp}
        />
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="text-base font-medium bg-transparent border-none outline-none focus:underline flex-1 min-w-0"
          placeholder="Document title"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowMobileStats}
          className="p-2"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowMobileDocuments}
          className="p-2"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}