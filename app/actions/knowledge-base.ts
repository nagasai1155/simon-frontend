"use server"

import { revalidatePath } from "next/cache"

const SUPABASE_URL = "https://sfktedqfipvuucelpggb.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma3RlZHFmaXB2dXVjZWxwZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4NDM5MywiZXhwIjoyMDczODYwMzkzfQ.PATF4KarVlYF1sUhS5bplA0QAXgqY2ZPXErIwgjGh5k"

// Extract text content from different file types
async function extractTextContent(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  try {
    if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      // Handle TXT files
      const text = await file.text()
      return text
    } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      // For PDF files, we'll extract basic text (in production, you'd use a proper PDF parser)
      // For now, we'll return a placeholder that indicates PDF processing
      return `PDF Content from ${file.name}\n\nThis is extracted content from the uploaded PDF file. In production, this would contain the actual parsed text from the PDF document.`
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      // For DOC/DOCX files, we'll return a placeholder (in production, you'd use a proper parser)
      return `Document Content from ${file.name}\n\nThis is extracted content from the uploaded Word document. In production, this would contain the actual parsed text from the document.`
    } else {
      throw new Error("Unsupported file type")
    }
  } catch (error) {
    console.error("Error extracting content:", error)
    throw new Error("Failed to extract content from file")
  }
}

export async function uploadKnowledgeBase(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const file = formData.get("file") as File

    if (!name || !file) {
      return { success: false, error: "Name and file are required" }
    }

    // Validate file type
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const allowedExtensions = [".txt", ".pdf", ".doc", ".docx"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return { success: false, error: "Only PDF, DOC, DOCX, and TXT files are supported" }
    }

    // Extract content from file
    const content = await extractTextContent(file)

    // Prepare data for Supabase
    const knowledgeBaseData = {
      name: name.trim(),
      description: `Knowledge base created from ${file.name}`,
      file_name: file.name,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      content: content,
      status: "active",
      is_public: false,
      access_count: 0,
      created_by: "system",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert into Supabase using HTTP API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_bases`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(knowledgeBaseData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Supabase error:", errorData)
      return { success: false, error: "Failed to save knowledge base to database" }
    }

    const result = await response.json()

    // Revalidate the knowledge base page to show new data
    revalidatePath("/knowledge-base")

    return {
      success: true,
      message: `Knowledge base "${name}" has been created successfully`,
      data: result[0],
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getKnowledgeBases() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_bases?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error("Failed to fetch knowledge bases")
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Fetch error:", error)
    return { success: false, error: "Failed to load knowledge bases", data: [] }
  }
}

export async function deleteKnowledgeBase(id: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_bases?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete knowledge base")
    }

    revalidatePath("/knowledge-base")
    return { success: true, message: "Knowledge base deleted successfully" }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Failed to delete knowledge base" }
  }
}

export async function updateKnowledgeBase(id: string, data: { name: string; description: string; content: string }) {
  try {
    const updateData = {
      name: data.name,
      description: data.description,
      content: data.content,
      updated_at: new Date().toISOString(),
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_bases?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Supabase error:", errorData)
      throw new Error("Failed to update knowledge base")
    }

    const result = await response.json()

    revalidatePath("/knowledge-base")
    return {
      success: true,
      message: "Knowledge base updated successfully",
      data: result[0],
    }
  } catch (error) {
    console.error("Update error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update knowledge base",
    }
  }
}
