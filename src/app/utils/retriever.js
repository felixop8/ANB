import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { createClient } from "@supabase/supabase-js"

const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY})
const sbApiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY
const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL
const client = createClient(sbUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: 'documents',
  queryName: 'match_documents'
})

// You can increase/reduce the number of chunks retrieved by increasing the limit i.e. vectorStore.asRetriever(10)
const retriever = vectorStore.asRetriever()

export default retriever;