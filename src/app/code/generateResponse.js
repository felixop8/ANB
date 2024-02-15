'use server';
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables"
import retriever from '@/app/utils/retriever'
import combineDocuments from '@/app/utils/combineDocuments'
import formatChatHistory from '@/app/utils/formatChatHistory'
const openAIApiKey = process.env.OPENAI_API_KEY

const chatHistory = []
const generateResponse = async (question) => {
  console.log(question)
  try {
    const llm = new ChatOpenAI({
      openAIApiKey,
      temperature: 0
    })
    
    const standaloneQuestionTemplate = `Given some chat history (if any) and a question, convert it to a standalone question. 
    Chat History: {chat_history} 
    question: {question} 
    standalone question:`
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

    const answerTemplate = `You are a helpful and enthusiastic assitant who can answer a given question for Félix based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that.". Don't try to make up an answer. Always speak as if you were chatting to your friend Félix.
    context: {context}
    chat history: {chat_history}
    question: {question}
    answer: `
    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

    const standaloneQuestionChain = RunnableSequence.from([
      standaloneQuestionPrompt,
      llm,
      new StringOutputParser()
    ])

    const retrieverChain = RunnableSequence.from([
      prevResult => prevResult.standalone_question,
      retriever,
      combineDocuments
    ])

    const answerChain = RunnableSequence.from([
      answerPrompt,
      llm,
      new StringOutputParser()
    ])

    const chain = RunnableSequence.from([
      {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({original_input}) => original_input.question,
        chat_history: ({original_input}) => original_input.chat_history
      },
      answerChain
    ])

    const response = await chain.invoke(
      {
        question: question,
        chat_history: formatChatHistory(chatHistory)
      }
   )
    chatHistory.push([question, response])
    return response
  } catch (error) {
    console.error(error)
  }

}

export default generateResponse;