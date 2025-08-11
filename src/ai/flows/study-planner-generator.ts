'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized 7-day study plan based on user-provided difficult subjects.
 *
 * - studyPlannerGenerator - A function that takes a list of subjects and generates a study plan.
 * - StudyPlannerInput - The input type for the studyPlannerGenerator function.
 * - StudyPlannerOutput - The return type for the studyPlannerGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyPlannerInputSchema = z.object({
  subjects: z.array(z.string()).describe('A list of subjects the user finds difficult.'),
});
export type StudyPlannerInput = z.infer<typeof StudyPlannerInputSchema>;

const StudyPlannerOutputSchema = z.object({
  studyPlan: z.string().describe('A 7-day study plan tailored to the user-specified subjects.'),
});
export type StudyPlannerOutput = z.infer<typeof StudyPlannerOutputSchema>;

export async function studyPlannerGenerator(input: StudyPlannerInput): Promise<StudyPlannerOutput> {
  return studyPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyPlannerPrompt',
  input: {schema: StudyPlannerInputSchema},
  output: {schema: StudyPlannerOutputSchema},
  prompt: `Create a personalized 7-day study plan for a student who finds the following subjects difficult: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}. The plan should be realistic, balancing theory and practical revision. Structure it day by day (Monday to Sunday). Include specific topics to cover for each subject on each day.`,
});

const studyPlannerFlow = ai.defineFlow(
  {
    name: 'studyPlannerFlow',
    inputSchema: StudyPlannerInputSchema,
    outputSchema: StudyPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
