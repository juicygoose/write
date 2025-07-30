"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocumentList } from "@/components/document-list";
import { SidebarDocumentList } from "@/components/sidebar-document-list";
import { ProjectSelector } from "@/components/project-selector";
import { saveDocument, getProjectDocuments, getProjects, getDocument } from "@/lib/actions";
import { loadPreferences, savePreference } from "@/lib/preferences";
import type { Document, Project } from "@/lib/database";
import {
  Save,
  FileText,
  Eye,
  EyeOff,
  Download,
  Upload,
  HelpCircle,
  Plus,
  FolderOpen,
  Focus,
  X,
} from "lucide-react";

interface WritingStats {
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
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null,
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<WritingStats>({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateStats = (text: string): WritingStats => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 WPM

    return { words, characters, paragraphs, readingTime };
  };

  useEffect(() => {
    setStats(calculateStats(content));
  }, [content]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (content && !isSaving && activeProject) {
        await saveToDatabase();
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(interval);
  }, [content, fileName, currentDocumentId, activeProject, isSaving]);

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
      setContent(preferences.lastContent || savedContent || '');
    }
    if (preferences.lastFileName !== 'Untitled Document' || savedFileName) {
      setFileName(preferences.lastFileName || savedFileName || 'Untitled Document');
    }
  }, []);

  // Save preferences when states change
  useEffect(() => {
    savePreference('showStats', showStats);
  }, [showStats]);

  useEffect(() => {
    savePreference('showDocumentsList', showDocumentsList);
  }, [showDocumentsList]);

  useEffect(() => {
    savePreference('isDistractionFree', isDistractionFree);
  }, [isDistractionFree]);

  useEffect(() => {
    if (currentDocumentId) {
      savePreference('currentDocumentId', currentDocumentId);
    }
  }, [currentDocumentId]);

  useEffect(() => {
    if (activeProject) {
      savePreference('currentProjectId', activeProject.id);
    }
  }, [activeProject]);

  useEffect(() => {
    savePreference('lastContent', content);
  }, [content]);

  useEffect(() => {
    savePreference('lastFileName', fileName);
  }, [fileName]);

  // Restore saved project and document after component mounts
  useEffect(() => {
    const restoreSavedState = async () => {
      const preferences = loadPreferences();
      
      try {
        // First load the saved project if it exists
        if (preferences.currentProjectId) {
          const projects = await getProjects();
          const savedProject = projects.find(p => p.id === preferences.currentProjectId);
          
          if (savedProject) {
            setActiveProject(savedProject);
            
            // Then try to load the saved document from that project
            if (preferences.currentDocumentId) {
              const savedDocument = await getDocument(preferences.currentDocumentId);
              if (savedDocument && savedDocument.project_id === savedProject.id) {
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
        console.error('Failed to restore saved state:', error);
      }
    };

    restoreSavedState();
  }, []); // Only run once on mount

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }

      // Cmd/Ctrl + O to load
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        fileInputRef.current?.click();
      }

      // Cmd/Ctrl + Shift + S to toggle stats
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
        setShowStats(!showStats);
      }

      // Cmd/Ctrl + Shift + D to toggle documents
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setShowDocumentsList(!showDocumentsList);
      }

      // Cmd/Ctrl + Shift + F to toggle distraction-free mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setIsDistractionFree(!isDistractionFree);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showStats, showDocumentsList, isDistractionFree]);

  const handleSave = async () => {
    await saveToDatabase();
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

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setFileName(file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsText(file);
    }
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      {!isDistractionFree && (
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <ProjectSelector
              activeProject={activeProject}
              onProjectSelect={handleProjectSelect}
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
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewDocument}
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
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Load
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {"Save"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
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
              isDistractionFree ? "p-16" : "p-8"
            }`}
            style={{
              lineHeight: "1.8",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          />
        </div>

        {/* Sidebar */}
        {!isDistractionFree && (showStats || showDocumentsList) && (
          <div className="w-80 border-l bg-muted/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Writing Statistics */}
              {showStats && (
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Writing Statistics
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl font-bold text-primary">
                          {stats.words}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Words
                        </div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl font-bold text-primary">
                          {stats.characters}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Characters
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl font-bold text-primary">
                          {stats.paragraphs}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Paragraphs
                        </div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="text-2xl font-bold text-primary">
                          {stats.readingTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Min Read
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Session Goals</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Daily Target:</span>
                          <span className="text-muted-foreground">
                            500 words
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((stats.words / 500) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {Math.round((stats.words / 500) * 100)}% complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
        onChange={handleLoad}
        className="hidden"
      />

      {/* Help Overlay */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowHelp(false)}
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
            <Button className="w-full mt-4" onClick={() => setShowHelp(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Documents List */}
      {showDocuments && (
        <DocumentList
          onDocumentSelect={handleDocumentSelect}
          onClose={() => setShowDocuments(false)}
        />
      )}
    </div>
  );
}

