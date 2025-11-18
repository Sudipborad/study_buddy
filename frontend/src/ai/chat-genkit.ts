// Direct OpenAI API implementation for chatbot only
// This bypasses Genkit to use OpenRouter directly

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL_NAME = 'openai/gpt-oss-20b:free';
const BASE_URL = 'https://openrouter.ai/api/v1';

if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable not set. Please add it to your .env.local file.");
}

export async function callOpenAIChat(messages: Array<{role: string, content: string}>): Promise<string> {
  try {
    console.log('Making OpenAI API call with messages:', messages.length);
    
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        'X-Title': 'Study Buddy'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        temperature: 0.3,  // Lower temperature for more structured responses
        max_tokens: 2000,  // More tokens for detailed pointwise answers
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stream: false
      })
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI API response data:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from OpenAI API');
    }

    const content = data.choices[0].message.content;
    console.log('Extracted content:', content);
    
    if (!content || typeof content !== 'string') {
      throw new Error('No valid content in API response');
    }

    return content.trim();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw new Error(`Failed to get response from chatbot: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}