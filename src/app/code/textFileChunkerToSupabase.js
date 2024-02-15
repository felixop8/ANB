'use server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';


/**
 * This script reads a text file, splits it into chunks using a text splitter,
 * and stores the chunks as documents in a Supabase vector store.
 */
const textFileChunkerToSupabase = async (text) => {
  console.log({text})
  try {
    
    // A text splitter that splits a string into chunks based on specified parameters.
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        separators: ['\n\n', '\n', ' ', ''],
        chunkOverlap: 50
    });
    

    // Creates documents from the given input text.
    const output = await splitter.createDocuments([text]);

    const sbApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
    const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;


    const client = createClient(sbUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbnFvcmFnanB5d3BzbmFzcmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyMzcxNzcsImV4cCI6MjAyMjgxMzE3N30.RRatFCvqVsnDZp8a23Ftjb9iD3OpVmpRXhW0oMM5R94')
    // Stores the chunks as documents in a Supabase vector store.
    const response = await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({openAIApiKey}),
        {
            client,
            tableName: 'documents',
        }
    ).then(console.log())
  } catch (err) {
    console.log(err);
  }
}

export default textFileChunkerToSupabase;

