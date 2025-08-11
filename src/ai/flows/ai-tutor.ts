
'use server';

/**
 * @fileOverview An AI-powered tutor flow that answers student questions based on a syllabus and conversation history.
 *
 * - aiTutor - A function that handles the tutoring process.
 * - AiTutorInput - The input type for the aiTutor function.
 * - AiTutorOutput - The return type for the aiTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({text: z.string()})),
});

const AiTutorInputSchema = z.object({
  question: z.string().describe("The student's current question."),
  syllabus: z.string().describe('The syllabus content.'),
  studentName: z.string().describe('The name of the student.'),
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
});
export type AiTutorInput = z.infer<typeof AiTutorInputSchema>;

const AiTutorOutputSchema = z.object({
  answer: z
    .string()
    .describe("The AI-generated answer to the student's question."),
});
export type AiTutorOutput = z.infer<typeof AiTutorOutputSchema>;

export async function aiTutor(input: AiTutorInput): Promise<AiTutorOutput> {
  return aiTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTutorPrompt',
  input: {schema: AiTutorInputSchema},
  output: {schema: AiTutorOutputSchema},
  prompt: `You are an AI Classroom Assistant for a student named {{{studentName}}}. Your personality is friendly, encouraging, and professional, like a helpful teaching assistant.

Your primary goal is to help the student learn and succeed.

General Guidelines:
- Your tone should be warm and conversational, but always maintain a respectful and professional boundary.
- When answering questions, prioritize the provided syllabus content. Explain concepts clearly and simply.
- If the question is outside the syllabus but still related to academics (e.g., general science, math, study skills), provide a helpful, concise answer.
- If the question is clearly off-topic, personal, or inappropriate, politely decline to answer and gently guide the conversation back to learning. For example: "That's an interesting question, but my purpose is to help you with your studies. Do you have any questions about the syllabus I can help with?"
- Guide students to find answers themselves rather than giving the solution directly, especially for exams or assignments.
- Be encouraging and patient, especially if the student is struggling.

Based on these guidelines, answer the student's question.

Syllabus Content: {{{syllabus}}}

{{#if history}}
Conversation History:
{{#each history}}
  {{this.role}}: {{#each this.parts}}{{{this.text}}}{{/each}}
{{/each}}
{{/if}}

Student Question: {{{question}}}
  `,
});

const aiTutorFlow = ai.defineFlow(
  {
    name: 'aiTutorFlow',
    inputSchema: AiTutorInputSchema,
    outputSchema: AiTutorOutputSchema,
  },
  async input => {
    // To make the prompt simpler, we'll replace 'model' with 'Assistant' and 'user' with 'Student'
    const processedHistory = input.history.map(msg => ({
        ...msg,
        role: msg.role === 'model' ? 'Assistant' : 'Student'
    })) as any;

    const {output} = await prompt({...input, history: processedHistory});
    return output!;
  }
);
