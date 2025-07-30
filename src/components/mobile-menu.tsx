"use client";

import { useState } from "react";
import {
  Menu,
  X,
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

  return (
    <>
      {/* Burger Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Menu Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
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
                      setIsOpen(false);
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
                      setIsOpen(false);
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
                      setIsOpen(false);
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
                      setIsOpen(false);
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
                      setIsOpen(false);
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
                      setIsOpen(false);
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
                      setIsOpen(false);
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
                    setIsOpen(false);
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Shortcuts
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
