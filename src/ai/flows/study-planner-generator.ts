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

const DailyPlanSchema = z.object({
  day: z.string().describe('The day of the week (e.g., Monday).'),
  plan: z.string().describe('The detailed study plan for that day, including topics and activities.'),
});

const StudyPlannerOutputSchema = z.object({
  dailyPlan: z.array(DailyPlanSchema).describe('A 7-day study plan, structured day-by-day.'),
});
export type StudyPlannerOutput = z.infer<typeof StudyPlannerOutputSchema>;

export async function studyPlannerGenerator(input: StudyPlannerInput): Promise<StudyPlannerOutput> {
  return studyPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyPlannerPrompt',
  input: {schema: StudyPlannerInputSchema},
  output: {schema: StudyPlannerOutputSchema},
  prompt: `Create a personalized 7-day study plan for a student who finds the following subjects difficult: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}. 

Your response must be structured as an array of daily plans, one for each day from Monday to Sunday. Each daily plan object should have two fields: 'day' and 'plan'. 
The 'plan' should be realistic, balancing theory and practical revision. Include specific topics to cover for each subject on each day.
Example for one day: { day: "Monday", plan: "Morning: Review [Subject A] notes on [Topic 1]. Afternoon: Practice problems for [Subject B] on [Topic 2]." }
Generate a complete plan for all 7 days of the week.`,
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
