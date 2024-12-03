import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai"
// import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { getAuth } from "@clerk/nextjs/server"
import { unlink, writeFile } from 'fs/promises';
import { createClerkSupabaseClientSsr } from '@/lib/supabase/server';
export async function POST(request: NextRequest) {
  const supabase = await createClerkSupabaseClientSsr()
  try {
     // 1. Auth check
     const { userId } = getAuth(request)
     if (!userId) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
     }
    // 2. Parse the multipart form data
    const formData = await request.formData()
    const title = formData.get('title') as string
    const file = formData.get('file') as File
    const content = formData.get('content') as string
     // Validate the data
     if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 })
    }

    if (file && content !== null) {
      return NextResponse.json({ error: "Cannot process both file and text content" }, { status: 400 })
    }


    // Handle text content upload
    if (content && content.length > 0) {
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          title,
          content:title,
          user_id:userId,
          type: 'TEXT',
        })
        .select()
        .single()

        if (docError){
          console.log('docError = ', docError)
          throw docError  
        }

        console.log('docData = ', docData)

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        })

        // store the chunks in supabase
        const chunks = await splitter.splitText(content)
        const embeddings = new OpenAIEmbeddings()
        const chunkPromises = chunks.map(async (chunk, i) => {
          const embedding = await embeddings.embedQuery(chunk)
          return supabase.from('document_chunks').insert({
            document_id: docData.id,
            metadata: JSON.stringify({
              source: 'text-input',
              position: i
            }),
            content: chunk,
            embedding,
          })
        })

        const done = await Promise.all(chunkPromises)
        console.log('done adding test chunks= ', done)


      if (docError) throw docError

      return NextResponse.json({ 
        success: true, 
        message: "Text content stored",
        documentId: docData.id
      })
    }

    // 3. save the file temporarily and load it
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = `/tmp/${file.name}`
    await writeFile(tempPath, buffer)
    const loader = new PDFLoader(tempPath)
    const docs = await loader.load()

    // 4. split the docs into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const chunks = await splitter.splitDocuments(docs)
    // 5. embed the chunks
    const embeddings = new OpenAIEmbeddings()
    console.log('embeddings = ', embeddings)
    // 6. store document metadata in supabase
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        title,
        user_id: userId,
        content: title,
        type: 'TEXT',
      })
      .select()
      .single()

    if (docError) throw docError

    console.log('1. docData = ', docData)

    // 7. store the chunks in supabase
    const chunkPromises = chunks.map(async (chunk) => {
      // Generate embedding for chunk
      const embedding = await embeddings.embedQuery(chunk.pageContent)

      // Store chunk and its embedding
      return supabase
        .from('document_chunks')
        .insert({
          document_id: docData.id,
          content: chunk.pageContent,
          embedding,
          metadata: chunk.metadata
        })
    })

    const done = await Promise.all(chunkPromises)


    console.log('done = ', done)

    // 8. Cleanup
    await unlink(tempPath)

    return NextResponse.json({ 
      success: true, 
      message: "Document processed and stored",
      documentId: docData.id
    })
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
} 