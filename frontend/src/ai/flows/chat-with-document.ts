'use server';

/**
 * @fileOverview This file defines a flow for chatting with a document using OpenAI/GPT.
 *
 * - chatWithDocument - A function that takes a document and a question and returns an answer.
 * - ChatWithDocumentInput - The input type for the chatWithDocument function.
 * - ChatWithDocumentOutput - The return type for the chatWithDocument function.
 */

import { callOpenAIChat } from '@/ai/chat-genkit';

export interface ChatWithDocumentInput {
  documentText: string;
  question: string;
}

export interface ChatWithDocumentOutput {
  answer: string;
}

export async function chatWithDocument(input: ChatWithDocumentInput): Promise<ChatWithDocumentOutput> {
  console.log('chatWithDocument called with input:', { 
    documentLength: input.documentText?.length || 0, 
    question: input.question 
  });

  const { documentText, question } = input;

  // Validate inputs
  if (!documentText || !question) {
    throw new Error('Both document text and question are required');
  }

  // Truncate document if too long to avoid token limits
  const maxDocLength = 3000;
  const truncatedDoc = documentText.length > maxDocLength 
    ? documentText.substring(0, maxDocLength) + '...\n[Document truncated for chat processing]'
    : documentText;

  // Create the chat messages for OpenAI API
  const messages = [
    {
      role: 'system',
      content: `You are a helpful AI assistant that provides clear, concise answers in pointwise format.

STRICT FORMATTING REQUIREMENTS:
- ALWAYS respond in bullet points or numbered lists
- Keep each point short and concise (1-2 sentences max)
- Use markdown formatting: **bold** for key terms, *italics* for emphasis
- Structure with main points and sub-points when needed
- Never write long paragraphs - break everything into points
- Use proper headings with ## for main topics

RESPONSE FORMAT EXAMPLE:
## Main Topic
1. **Key Point 1** - Brief explanation
2. **Key Point 2** - Brief explanation
   - Sub-point with details
   - Another relevant sub-point
3. **Key Point 3** - Brief explanation

CONTENT GUIDELINES:
- Base answers primarily on the document content below
- Add general knowledge only when helpful for context
- If document lacks info, clearly state this in points
- Keep language clear and academic

Document Content:
${truncatedDoc}`
    },
    {
      role: 'user',
      content: `Please answer this question about the document in clear pointwise format with bullet points or numbered lists:

${question}

Remember to format your response with:
- Clear bullet points or numbered lists
- **Bold** key terms
- Short, concise points
- Proper structure with headings if needed`
    }
  ];

  try {
    console.log('Calling OpenAI API...');
    const answer = await callOpenAIChat(messages);
    
    if (!answer) {
      throw new Error('Received empty response from AI');
    }

    console.log('Successfully got response from OpenAI');
    return { answer };
  } catch (error) {
    console.error('Error in chatWithDocument:', error);
    
    // Provide a fallback response instead of throwing
    const fallbackAnswer = `I apologize, but I'm having trouble processing your question about the document right now. 

Error: ${error instanceof Error ? error.message : 'Unknown error'}

Please try rephrasing your question or check if the document was uploaded correctly.`;
    
    return { answer: fallbackAnswer };
  }
}
