'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Plus, Folder } from 'lucide-react'
import { getProjects, saveProject } from '@/lib/actions'
import type { Project } from '@/lib/database'

interface ProjectSelectorProps {
  activeProject: Project | null
  onProjectSelect: (project: Project) => void | Promise<void>
}

export function ProjectSelector({ activeProject, onProjectSelect }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-8"
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: activeProject?.color || '#3b82f6' }}
          />
          <span className="font-medium">{activeProject?.name || 'Select Project'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          SELECT PROJECT
        </DropdownMenuLabel>
        
        <div className="max-h-40 overflow-y-auto">
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={async () => {
                await onProjectSelect(project)
              }}
              className={`flex items-center gap-2 ${
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
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        
        {showCreateForm ? (
          <div className="p-2">
            <form onSubmit={handleCreateProject} className="space-y-2">
              <Input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className="h-7 text-sm"
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
          </div>
        ) : (
          <DropdownMenuItem
            onClick={() => setShowCreateForm(true)}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Project
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}