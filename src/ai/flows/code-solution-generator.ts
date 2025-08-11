'use server';
/**
 * @fileOverview An AI agent that generates code solutions and explanations for lab exercises.
 *
 * - codeSolutionGenerator - A function that generates code solutions and explanations.
 * - CodeSolutionGeneratorInput - The input type for the codeSolutionGenerator function.
 * - CodeSolutionGeneratorOutput - The return type for the codeSolutionGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeSolutionGeneratorInputSchema = z.object({
  exerciseDescription: z
    .string()
    .describe('The description of the lab exercise, including the programming language.'),
});
export type CodeSolutionGeneratorInput = z.infer<typeof CodeSolutionGeneratorInputSchema>;

const CodeSolutionGeneratorOutputSchema = z.object({
  codeSolution: z
    .string()
    .describe('The code solution for the lab exercise.'),
  explanation: z.string().describe('The explanation of the code solution.'),
});
export type CodeSolutionGeneratorOutput = z.infer<typeof CodeSolutionGeneratorOutputSchema>;

export async function codeSolutionGenerator(
  input: CodeSolutionGeneratorInput
): Promise<CodeSolutionGeneratorOutput> {
  return codeSolutionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeSolutionGeneratorPrompt',
  input: {schema: CodeSolutionGeneratorInputSchema},
  output: {schema: CodeSolutionGeneratorOutputSchema},
  prompt: `You are an expert programming tutor specializing in providing code solutions and explanations for lab exercises.

You will receive a description of a lab exercise, and your goal is to provide both the code solution and a clear explanation of the code.

Exercise Description: {{{exerciseDescription}}}

Ensure the code is well-formatted and easy to understand. The explanation should guide the student through the logic and key concepts used in the code.

Your response MUST be in the following format:

**Code Solution:**
\`\`\`
[Your Code Solution Here]
\`\`\`

**Explanation:**
[Your Explanation Here] `,
});

const codeSolutionGeneratorFlow = ai.defineFlow(
  {
    name: 'codeSolutionGeneratorFlow',
    inputSchema: CodeSolutionGeneratorInputSchema,
    outputSchema: CodeSolutionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
