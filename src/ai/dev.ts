'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/recommend-videos.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/chat-with-document.ts';
