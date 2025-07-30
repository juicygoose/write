'use server'

import { revalidatePath } from 'next/cache'
import { stackServerApp } from '@/stack'
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
    const user = await stackServerApp.getUser({ or: 'throw' })
    const documents = await getAllDocuments(user.id)
    return documents
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    throw new Error('Failed to fetch documents')
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  try {
    const user = await stackServerApp.getUser({ or: 'throw' })
    const document = await getDocumentById(id, user.id)
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
    const user = await stackServerApp.getUser({ or: 'throw' })
    let document: Document

    if (id) {
      // Update existing document
      const updatedDocument = await updateDocument(id, title, content, user.id)
      if (!updatedDocument) {
        throw new Error('Document not found')
      }
      document = updatedDocument
    } else {
      // Create new document
      document = await createDocument(title, content, projectId, user.id)
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
    const user = await stackServerApp.getUser({ or: 'throw' })
    const success = await deleteDocument(id, user.id)
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
    const user = await stackServerApp.getUser({ or: 'throw' })
    const projects = await getAllProjects(user.id)
    return projects
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const user = await stackServerApp.getUser({ or: 'throw' })
    const project = await getProjectById(id, user.id)
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
    const user = await stackServerApp.getUser({ or: 'throw' })
    const project = await createProject(name, description, color, user.id)
    revalidatePath('/')
    return project
  } catch (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }
}

export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  try {
    const user = await stackServerApp.getUser({ or: 'throw' })
    const documents = await getDocumentsByProject(projectId, user.id)
    return documents
  } catch (error) {
    console.error('Failed to fetch project documents:', error)
    throw new Error('Failed to fetch project')
  }
}