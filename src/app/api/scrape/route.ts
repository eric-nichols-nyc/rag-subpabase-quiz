// api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClerkSupabaseClientSsr } from '@/lib/supabase/server';
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { scrapeUrl } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  const supabase = await createClerkSupabaseClientSsr();
  
  try {
    // 1. Auth check
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get URL from request and validate
    const body = await request.json().catch(() => ({}));
    const { url } = body;
  
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ 
        error: "Invalid URL provided" 
      }, { status: 400 });
    }

    // 3. Scrape the URL with error handling
    const scrapedData = await scrapeUrl(url).catch((error) => {
      console.error('Scraping error:', error);
      throw new Error(`Failed to scrape URL: ${error.message}`);
    });

    if (!scrapedData || !scrapedData.content) {
      return NextResponse.json({ 
        error: "Failed to extract content from URL" 
      }, { status: 400 });
    }

    const { title, content } = scrapedData;

    // 4. Split content into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    if (!content.trim()) {
      return NextResponse.json({ 
        error: "No content found to process" 
      }, { status: 400 });
    }

    const docs = await splitter.createDocuments([content]);

    // 5. Store document metadata in Supabase
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        title: title || 'Untitled Document',
        user_id: userId,
        file_name: url,
        file_url: url, 
        type: 'URL',
        content
      })
      .select()
      .single();

    if (docError) {
      console.error('Supabase document insert error:', docError);
      throw docError;
    }

    // 6. Create embeddings and store chunks
    const embeddings = new OpenAIEmbeddings();

   // 7. Store chunks in Supabase
   const chunkPromises = docs.map(async (chunk) => {
    const embedding = await embeddings.embedQuery(chunk.pageContent);
    return supabase.from('document_chunks').insert({
      document_id: docData.id,
      content: chunk.pageContent,
      embedding,
      metadata: chunk.metadata
    });
   });

   const done = await Promise.all(chunkPromises);
   console.log('done = ', done);

    return NextResponse.json({
      success: true,
      message: "URL content processed and stored",
      documentId: docData.id
    });
  } catch (error) {
    console.error('Error processing URL:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process URL',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}