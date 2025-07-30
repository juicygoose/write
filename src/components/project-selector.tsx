'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Plus, Folder } from 'lucide-react'
import { getProjects, saveProject } from '@/lib/actions'
import type { Project } from '@/lib/database'

interface ProjectSelectorProps {
  activeProject: Project | null
  onProjectSelect: (project: Project) => void | Promise<void>
}

export function ProjectSelector({ activeProject, onProjectSelect }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const projectList = await getProjects()
      setProjects(projectList)
      
      // Note: We don't auto-select the first project here anymore
      // The WritingEditor handles restoring the saved project
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      const newProject = await saveProject(newProjectName.trim())
      setProjects([newProject, ...projects])
      await onProjectSelect(newProject)
      setNewProjectName('')
      setShowCreateForm(false)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-md">
        <Folder className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8"
      >
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: activeProject?.color || '#3b82f6' }}
        />
        <span className="font-medium">{activeProject?.name || 'Select Project'}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
              SELECT PROJECT
            </div>
            
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={async () => {
                    await onProjectSelect(project)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left hover:bg-muted/50 transition-colors ${
                    activeProject?.id === project.id ? 'bg-muted' : ''
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{project.name}</div>
                    {project.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {project.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t mt-2 pt-2">
              {showCreateForm ? (
                <form onSubmit={handleCreateProject} className="space-y-2">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full px-2 py-1 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button type="submit" size="sm" className="h-7 text-xs">
                      Create
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewProjectName('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                  className="w-full justify-start h-8 text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false)
            setShowCreateForm(false)
            setNewProjectName('')
          }}
        />
      )}
    </div>
  )
}