'use server';

/**
 * @fileOverview An AI-powered tutor flow that answers student questions based on a syllabus.
 *
 * - aiTutor - A function that handles the tutoring process.
 * - AiTutorInput - The input type for the aiTutor function.
 * - AiTutorOutput - The return type for the aiTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTutorInputSchema = z.object({
  question: z.string().describe('The student\'s question.'),
  syllabus: z.string().describe('The syllabus content.'),
  studentName: z.string().describe('The name of the student.'),
});
export type AiTutorInput = z.infer<typeof AiTutorInputSchema>;

const AiTutorOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the student\'s question.'),
});
export type AiTutorOutput = z.infer<typeof AiTutorOutputSchema>;

export async function aiTutor(input: AiTutorInput): Promise<AiTutorOutput> {
  return aiTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTutorPrompt',
  input: {schema: AiTutorInputSchema},
  output: {schema: AiTutorOutputSchema},
  prompt: `You are a friendly, expert, and encouraging AI Classroom Assistant for a student named {{{studentName}}}. Your primary goal is to help them learn and succeed in their exams.

  Answer the following question based on the provided syllabus content:
  Question: {{{question}}}

  Syllabus Content: {{{syllabus}}}

  If the question is not covered by the syllabus, politely say that you cannot answer it.
  `,
});

const aiTutorFlow = ai.defineFlow(
  {
    name: 'aiTutorFlow',
    inputSchema: AiTutorInputSchema,
    outputSchema: AiTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
