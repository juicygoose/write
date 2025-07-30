import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export type Project = {
  id: string
  name: string
  description: string
  color: string
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  title: string
  content: string
  word_count: number
  character_count: number
  project_id: string
  created_at: string
  updated_at: string
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY updated_at DESC
    `
    return projects as Project[]
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE id = ${id}
    `
    return projects[0] as Project || null
  } catch (error) {
    console.error('Failed to fetch project:', error)
    throw new Error('Failed to fetch project')
  }
}

export async function createProject(
  name: string, 
  description: string = '',
  color: string = '#3b82f6'
): Promise<Project> {
  try {
    const projects = await sql`
      INSERT INTO projects (name, description, color)
      VALUES (${name}, ${description}, ${color})
      RETURNING *
    `
    return projects[0] as Project
  } catch (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }
}

export async function getAllDocuments(): Promise<Document[]> {
  try {
    const documents = await sql`
      SELECT * FROM documents 
      ORDER BY updated_at DESC
    `
    return documents as Document[]
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    throw new Error('Failed to fetch documents')
  }
}

export async function getDocumentsByProject(projectId: string): Promise<Document[]> {
  try {
    const documents = await sql`
      SELECT * FROM documents 
      WHERE project_id = ${projectId}
      ORDER BY updated_at DESC
    `
    return documents as Document[]
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    throw new Error('Failed to fetch documents')
  }
}

export async function getDocumentById(id: string): Promise<Document | null> {
  try {
    const documents = await sql`
      SELECT * FROM documents 
      WHERE id = ${id}
    `
    return documents[0] as Document || null
  } catch (error) {
    console.error('Failed to fetch document:', error)
    throw new Error('Failed to fetch document')
  }
}

export async function createDocument(
  title: string, 
  content: string,
  projectId: string
): Promise<Document> {
  try {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const characterCount = content.length

    const documents = await sql`
      INSERT INTO documents (title, content, word_count, character_count, project_id)
      VALUES (${title}, ${content}, ${wordCount}, ${characterCount}, ${projectId})
      RETURNING *
    `
    return documents[0] as Document
  } catch (error) {
    console.error('Failed to create document:', error)
    throw new Error('Failed to create document')
  }
}

export async function updateDocument(
  id: string,
  title: string,
  content: string
): Promise<Document | null> {
  try {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const characterCount = content.length

    const documents = await sql`
      UPDATE documents 
      SET title = ${title}, content = ${content}, word_count = ${wordCount}, character_count = ${characterCount}
      WHERE id = ${id}
      RETURNING *
    `
    return documents[0] as Document || null
  } catch (error) {
    console.error('Failed to update document:', error)
    throw new Error('Failed to update document')
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM documents 
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error('Failed to delete document:', error)
    throw new Error('Failed to delete document')
  }
}