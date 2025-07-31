"use client";

import { useState } from "react";
import {
  Menu,
  Plus,
  FolderOpen,
  Eye,
  EyeOff,
  Upload,
  Save,
  Download,
  Focus,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { ProjectSelector } from "@/components/project-selector";
import type { Project } from "@/lib/database";

interface MobileMenuProps {
  activeProject: Project | null;
  onProjectSelect: (project: Project) => void;
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
}

export function MobileMenu({
  activeProject,
  onProjectSelect,
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
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          {/* Project Selector */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Project
            </h3>
            <ProjectSelector
              activeProject={activeProject}
              onProjectSelect={onProjectSelect}
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Account
            </h3>
            <div className="flex items-center gap-2">
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNewDocument();
                  handleClose();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onLoad();
                  handleClose();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Load File
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onSave();
                  handleClose();
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onExport();
                  handleClose();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* View Options */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              View
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onToggleStats();
                  handleClose();
                }}
              >
                {showStats ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showStats ? "Hide Stats" : "Show Stats"}
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onToggleDocuments();
                  handleClose();
                }}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                {showDocumentsList ? "Hide Documents" : "Show Documents"}
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onToggleFocus();
                  handleClose();
                }}
              >
                <Focus className="h-4 w-4 mr-2" />
                Focus Mode
              </Button>
            </div>
          </div>

          {/* Help */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onShowHelp();
                handleClose();
              }}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Shortcuts
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
