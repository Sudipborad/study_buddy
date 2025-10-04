import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set. Please add it to your .env.local file.");
}


export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash', // This `model` key is not a valid property for genkit({})
});