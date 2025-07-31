"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/document-list";
import { SidebarDocumentList } from "@/components/sidebar-document-list";
import { MobileModal } from "@/components/mobile-modal";
import { WritingStats } from "@/components/writing-stats";
import { EditorHeader } from "@/components/editor-header";
import { MobileHeader } from "@/components/mobile-header";
import { HelpOverlay } from "@/components/help-overlay";
import { TextSelectionChat } from "@/components/text-selection-chat";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useDocumentOperations } from "@/hooks/use-document-operations";
import { useTextSelection } from "@/hooks/use-text-selection";
import {
  getProjectDocuments,
  getProjects,
  getDocument,
} from "@/lib/actions";
import { loadPreferences, savePreference } from "@/lib/preferences";
import type { Document, Project } from "@/lib/database";
import { X } from "lucide-react";

interface WritingStatsData {
  words: number;
  characters: number;
  paragraphs: number;
  readingTime: number;
}

export function WritingEditor() {
  const [content, setContent] = useState("");
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showDocumentsList, setShowDocumentsList] = useState(false);
  const [fileName, setFileName] = useState("Untitled Document");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showMobileDocuments, setShowMobileDocuments] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null,
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<WritingStatsData>({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousContentRef = useRef<string>("");
  const { selectedText, clearSelection } = useTextSelection(textareaRef);

  const {
    isSaving,
    fileInputRef,
    saveToDatabase,
    handleExport,
    handleLoad,
    triggerFileInput,
  } = useDocumentOperations({
    content,
    fileName,
    currentDocumentId,
    activeProject,
    setLastSaved,
    setCurrentDocumentId,
  });

  const calculateStats = (text: string): WritingStatsData => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 WPM

    return { words, characters, paragraphs, readingTime };
  };

  useEffect(() => {
    setStats(calculateStats(content));
  }, [content]);

  useKeyboardShortcuts({
    showStats,
    showDocumentsList,
    isDistractionFree,
    onSave: saveToDatabase,
    onLoad: triggerFileInput,
    onToggleStats: () => setShowStats(!showStats),
    onToggleDocumentsList: () => setShowDocumentsList(!showDocumentsList),
    onToggleDistractionFree: () => setIsDistractionFree(!isDistractionFree),
  });

  useEffect(() => {
    // Save only when content changes, not on a timer
    if (
      content &&
      content !== previousContentRef.current &&
      !isSaving &&
      activeProject &&
      previousContentRef.current !== "" // Don't save on initial load
    ) {
      saveToDatabase();
    }
    previousContentRef.current = content;
  }, [content, fileName, currentDocumentId, activeProject, isSaving, saveToDatabase]);

  useEffect(() => {
    // Load preferences first
    const preferences = loadPreferences();
    setShowStats(preferences.showStats);
    setShowDocumentsList(preferences.showDocumentsList);
    setIsDistractionFree(preferences.isDistractionFree);

    // Load legacy content from localStorage for backward compatibility
    const savedContent = localStorage.getItem("writing-editor-content");
    const savedFileName = localStorage.getItem("writing-editor-filename");

    // Use preferences if available, otherwise fall back to legacy localStorage
    if (preferences.lastContent || savedContent) {
      setContent(preferences.lastContent || savedContent || "");
    }
    if (preferences.lastFileName !== "Untitled Document" || savedFileName) {
      setFileName(
        preferences.lastFileName || savedFileName || "Untitled Document",
      );
    }
  }, []);

  // Save preferences when states change
  useEffect(() => {
    savePreference("showStats", showStats);
  }, [showStats]);

  useEffect(() => {
    savePreference("showDocumentsList", showDocumentsList);
  }, [showDocumentsList]);

  useEffect(() => {
    savePreference("isDistractionFree", isDistractionFree);
  }, [isDistractionFree]);

  useEffect(() => {
    if (currentDocumentId) {
      savePreference("currentDocumentId", currentDocumentId);
    }
  }, [currentDocumentId]);

  useEffect(() => {
    if (activeProject) {
      savePreference("currentProjectId", activeProject.id);
    }
  }, [activeProject]);

  useEffect(() => {
    savePreference("lastContent", content);
  }, [content]);

  useEffect(() => {
    savePreference("lastFileName", fileName);
  }, [fileName]);

  // Restore saved project and document after component mounts
  useEffect(() => {
    const restoreSavedState = async () => {
      const preferences = loadPreferences();

      try {
        // First load the saved project if it exists
        if (preferences.currentProjectId) {
          const projects = await getProjects();
          const savedProject = projects.find(
            (p) => p.id === preferences.currentProjectId,
          );

          if (savedProject) {
            setActiveProject(savedProject);

            // Then try to load the saved document from that project
            if (preferences.currentDocumentId) {
              const savedDocument = await getDocument(
                preferences.currentDocumentId,
              );
              if (
                savedDocument &&
                savedDocument.project_id === savedProject.id
              ) {
                handleDocumentSelect(savedDocument);
                return; // Successfully restored saved document
              }
            }

            // If no saved document or it doesn't exist, load the most recent from project
            const documents = await getProjectDocuments(savedProject.id);
            if (documents.length > 0) {
              handleDocumentSelect(documents[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to restore saved state:", error);
      }
    };

    restoreSavedState();
  }, []); // Only run once on mount


  const handleNewDocument = () => {
    setContent("");
    setFileName("Untitled Document");
    setCurrentDocumentId(null);
    setLastSaved(null);
  };

  const handleDocumentSelect = (document: Document) => {
    setContent(document.content);
    setFileName(document.title);
    setCurrentDocumentId(document.id);
    setLastSaved(new Date(document.updated_at));
  };

  const handleProjectSelect = async (project: Project) => {
    setActiveProject(project);

    try {
      // Get the most recent document from the selected project
      const documents = await getProjectDocuments(project.id);

      if (documents.length > 0) {
        // Load the most recently updated document
        const mostRecentDocument = documents[0]; // Already sorted by updated_at DESC
        handleDocumentSelect(mostRecentDocument);
      } else {
        // Clear the editor if no documents in project
        setContent("");
        setFileName("Untitled Document");
        setCurrentDocumentId(null);
        setLastSaved(null);
      }
    } catch (error) {
      console.error("Failed to load project documents:", error);
      // Clear the editor on error
      setContent("");
      setFileName("Untitled Document");
      setCurrentDocumentId(null);
      setLastSaved(null);
    }
  };

  const handleLoadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleLoad(event, (content, fileName) => {
      setContent(content);
      setFileName(fileName);
    });
  };

  const handleAIChat = () => {
    setShowAIChat(true);
  };

  const handleCloseChatAndClearSelection = () => {
    setShowAIChat(false);
    clearSelection();
    
    // Clear the actual text selection in the textarea
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionStart
      );
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Desktop Header */}
      {!isDistractionFree && (
        <EditorHeader
          activeProject={activeProject}
          onProjectSelect={handleProjectSelect}
          fileName={fileName}
          setFileName={setFileName}
          lastSaved={lastSaved}
          showStats={showStats}
          setShowStats={setShowStats}
          showDocumentsList={showDocumentsList}
          setShowDocumentsList={setShowDocumentsList}
          isDistractionFree={isDistractionFree}
          setIsDistractionFree={setIsDistractionFree}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
          onNewDocument={handleNewDocument}
          onLoad={triggerFileInput}
          onSave={saveToDatabase}
          onExport={handleExport}
          selectedText={selectedText}
          onAIChat={handleAIChat}
        />
      )}

      {/* Mobile Header */}
      {!isDistractionFree && (
        <MobileHeader
          activeProject={activeProject}
          onProjectSelect={handleProjectSelect}
          fileName={fileName}
          setFileName={setFileName}
          showStats={showStats}
          showDocumentsList={showDocumentsList}
          onToggleStats={() => setShowStats(!showStats)}
          onToggleDocuments={() => setShowDocumentsList(!showDocumentsList)}
          onNewDocument={handleNewDocument}
          onLoad={triggerFileInput}
          onSave={saveToDatabase}
          onExport={handleExport}
          onToggleFocus={() => setIsDistractionFree(!isDistractionFree)}
          onShowHelp={() => setShowHelp(!showHelp)}
          onShowMobileStats={() => setShowMobileStats(true)}
          onShowMobileDocuments={() => setShowMobileDocuments(true)}
          selectedText={selectedText}
          onAIChat={handleAIChat}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your story..."
            className={`flex-1 resize-none outline-none bg-background text-foreground text-lg leading-relaxed font-serif transition-all duration-300 ${
              isDistractionFree ? "p-8 lg:p-16" : "p-4 lg:p-8"
            }`}
            style={{
              lineHeight: "1.8",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          />
        </div>

        {/* Desktop Sidebar */}
        {!isDistractionFree && (showStats || showDocumentsList) && (
          <div className="hidden lg:block w-80 border-l bg-muted/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Writing Statistics */}
              {showStats && <WritingStats stats={stats} />}

              {/* Document List */}
              {showDocumentsList && (
                <div className={showStats ? "border-t pt-6" : ""}>
                  <SidebarDocumentList
                    onDocumentSelect={handleDocumentSelect}
                    currentDocumentId={currentDocumentId}
                    activeProject={activeProject}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Distraction-Free Mode Exit Button */}
      {isDistractionFree && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDistractionFree(false)}
            className="flex items-center gap-2 bg-background/95 backdrop-blur border shadow-lg hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
            Exit Focus
          </Button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx"
        onChange={handleLoadFile}
        className="hidden"
      />

      {/* Help Overlay */}
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Mobile Stats Modal */}
      <MobileModal
        isOpen={showMobileStats}
        onClose={() => setShowMobileStats(false)}
        title="Writing Statistics"
      >
        <WritingStats stats={stats} showTitle={false} />
      </MobileModal>

      {/* Mobile Documents Modal */}
      <MobileModal
        isOpen={showMobileDocuments}
        onClose={() => setShowMobileDocuments(false)}
        title="Documents"
      >
        <SidebarDocumentList
          onDocumentSelect={(doc) => {
            handleDocumentSelect(doc);
            setShowMobileDocuments(false);
          }}
          currentDocumentId={currentDocumentId}
          activeProject={activeProject}
        />
      </MobileModal>

      {/* Documents List */}
      {showDocuments && (
        <DocumentList
          onDocumentSelect={handleDocumentSelect}
          onClose={() => setShowDocuments(false)}
        />
      )}

      {/* Text Selection Chat */}
      <TextSelectionChat
        selectedText={selectedText}
        isOpen={showAIChat}
        onClose={handleCloseChatAndClearSelection}
      />
    </div>
  );
}
