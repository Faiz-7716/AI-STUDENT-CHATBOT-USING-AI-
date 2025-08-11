'use server';

/**
 * @fileOverview An exam strategy AI agent.
 *
 * - examStrategyGenerator - A function that handles the exam strategy generation process.
 * - ExamStrategyInput - The input type for the examStrategyGenerator function.
 * - ExamStrategyOutput - The return type for the examStrategyGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExamStrategyInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate exam strategy tips.'),
});
export type ExamStrategyInput = z.infer<typeof ExamStrategyInputSchema>;

const ExamStrategyOutputSchema = z.object({
  likelyQuestions: z.string().describe('A list of likely exam questions for the subject.'),
  revisionNotes: z.string().describe('Short revision notes for the main concepts in the subject.'),
  modelAnswer: z.string().describe('A model long answer for a question on the subject, structured for university exams.'),
});
export type ExamStrategyOutput = z.infer<typeof ExamStrategyOutputSchema>;

export async function examStrategyGenerator(input: ExamStrategyInput): Promise<ExamStrategyOutput> {
  return examStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'examStrategyPrompt',
  input: {schema: ExamStrategyInputSchema},
  output: {schema: ExamStrategyOutputSchema},
  prompt: `You are an expert exam strategy assistant for university students.

You will generate exam strategy tips for the subject: {{{subject}}}.

Specifically, you will generate the following:

*   likelyQuestions: A list of 5 likely exam questions for the subject.
*   revisionNotes: Short, point-wise revision notes for the main concepts in the subject.
*   modelAnswer: A model long answer, structured for university exams, for a question on the subject.

Make sure the model answer is very detailed.

Output in plain text.
`,
});

const examStrategyFlow = ai.defineFlow(
  {
    name: 'examStrategyFlow',
    inputSchema: ExamStrategyInputSchema,
    outputSchema: ExamStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
