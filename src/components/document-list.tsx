'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Trash2, Calendar } from 'lucide-react'
import { getDocuments, removeDocument } from '@/lib/actions'
import type { Document } from '@/lib/database'

interface DocumentListProps {
  onDocumentSelect: (document: Document) => void
  onClose: () => void
}

export function DocumentList({ onDocumentSelect, onClose }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const docs = await getDocuments()
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
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading documents...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Documents</h3>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents yet. Start writing to create your first document!</p>
          </div>
        ) : (
          <div className="overflow-y-auto space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                onClick={() => {
                  onDocumentSelect(document)
                  onClose()
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h4 className="font-medium truncate">{document.title}</h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {document.content.slice(0, 120)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={(e) => handleDelete(e, document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}