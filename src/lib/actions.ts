'use server'

import { revalidatePath } from 'next/cache'
import { 
  getAllDocuments, 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  getAllProjects,
  getProjectById,
  createProject,
  getDocumentsByProject,
  type Document,
  type Project
} from './database'

export async function getDocuments(): Promise<Document[]> {
  try {
    const documents = await getAllDocuments()
    return documents
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    throw new Error('Failed to fetch documents')
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  try {
    const document = await getDocumentById(id)
    return document
  } catch (error) {
    console.error('Failed to fetch document:', error)
    throw new Error('Failed to fetch document')
  }
}

export async function saveDocument(
  title: string,
  content: string,
  projectId: string,
  id?: string
): Promise<Document> {
  try {
    let document: Document

    if (id) {
      // Update existing document
      const updatedDocument = await updateDocument(id, title, content)
      if (!updatedDocument) {
        throw new Error('Document not found')
      }
      document = updatedDocument
    } else {
      // Create new document
      document = await createDocument(title, content, projectId)
    }

    revalidatePath('/')
    return document
  } catch (error) {
    console.error('Failed to save document:', error)
    throw new Error('Failed to save document')
  }
}

export async function removeDocument(id: string): Promise<void> {
  try {
    const success = await deleteDocument(id)
    if (!success) {
      throw new Error('Document not found')
    }
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete document:', error)
    throw new Error('Failed to delete document')
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await getAllProjects()
    return projects
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const project = await getProjectById(id)
    return project
  } catch (error) {
    console.error('Failed to fetch project:', error)
    throw new Error('Failed to fetch project')
  }
}

export async function saveProject(
  name: string,
  description: string = '',
  color: string = '#3b82f6'
): Promise<Project> {
  try {
    const project = await createProject(name, description, color)
    revalidatePath('/')
    return project
  } catch (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }
}

export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  try {
    const documents = await getDocumentsByProject(projectId)
    return documents
  } catch (error) {
    console.error('Failed to fetch project documents:', error)
    throw new Error('Failed to fetch project documents')
  }
}