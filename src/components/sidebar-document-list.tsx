'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Trash2, Calendar, FolderOpen } from 'lucide-react'
import { getProjectDocuments, removeDocument } from '@/lib/actions'
import type { Document, Project } from '@/lib/database'

interface SidebarDocumentListProps {
  onDocumentSelect: (document: Document) => void
  currentDocumentId?: string | null
  activeProject: Project | null
}

export function SidebarDocumentList({ onDocumentSelect, currentDocumentId, activeProject }: SidebarDocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [activeProject])

  const fetchDocuments = async () => {
    if (!activeProject) {
      setDocuments([])
      setLoading(false)
      return
    }

    try {
      const docs = await getProjectDocuments(activeProject.id)
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      await removeDocument(id)
      setDocuments(documents.filter(doc => doc.id !== id))
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <FolderOpen className="h-4 w-4" />
        {activeProject ? `${activeProject.name} (${documents.length})` : 'Documents (0)'}
      </h3>

      {documents.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No documents yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {documents.map((document) => (
            <div
              key={document.id}
              className={`p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group text-sm ${
                currentDocumentId === document.id ? 'bg-muted border-primary' : ''
              }`}
              onClick={() => onDocumentSelect(document)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <h4 className="font-medium truncate text-xs">{document.title}</h4>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {document.content.slice(0, 60)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{document.word_count} words</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(document.updated_at)}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-6 w-6 p-0"
                  onClick={(e) => handleDelete(e, document.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}