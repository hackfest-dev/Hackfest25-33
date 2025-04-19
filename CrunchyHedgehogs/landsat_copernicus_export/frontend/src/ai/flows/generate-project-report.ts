'use server';
/**
 * @fileOverview A project report generation AI agent.
 *
 * - generateProjectReport - A function that handles the project report generation process.
 * - GenerateProjectReportInput - The input type for the generateProjectReport function.
 * - GenerateProjectReportOutput - The return type for the generateProjectReport function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {GeoLocationInfo} from '@/services/geo-location';

const GenerateProjectReportInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  geoLocationInfo: z.object({
    displayName: z.string().describe('The display name of the location.'),
    location: z.object({
      lat: z.number().describe('The latitude of the location.'),
      lng: z.number().describe('The longitude of the location.'),
    }).describe('The latitude and longitude coordinates of the location.'),
  }).describe('Geographic information for the project location.'),
  constructionGoals: z.string().describe('The construction goals for the project.'),
  costMetrics: z.string().describe('Data analytics chart based on cost metrics.'),
  timeMetrics: z.string().describe('Data analytics chart based on time metrics.'),
  permissions: z.string().describe('Permissions received for the project.'),
});
export type GenerateProjectReportInput = z.infer<typeof GenerateProjectReportInputSchema>;

const GenerateProjectReportOutputSchema = z.object({
  report: z.string().describe('The generated project report.'),
});
export type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

export async function generateProjectReport(input: GenerateProjectReportInput): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: {
    schema: z.object({
      projectName: z.string().describe('The name of the project.'),
      geoLocationInfo: z.object({
        displayName: z.string().describe('The display name of the location.'),
        location: z.object({
          lat: z.number().describe('The latitude of the location.'),
          lng: z.number().describe('The longitude of the location.'),
        }).describe('The latitude and longitude coordinates of the location.'),
      }).describe('Geographic information for the project location.'),
      constructionGoals: z.string().describe('The construction goals for the project.'),
      costMetrics: z.string().describe('Data analytics chart based on cost metrics.'),
      timeMetrics: z.string().describe('Data analytics chart based on time metrics.'),
      permissions: z.string().describe('Permissions received for the project.'),
    }),
  },
  output: {
    schema: z.object({
      report: z.string().describe('The generated project report.'),
    }),
  },
  prompt: `You are an expert in generating project reports for construction projects.

  Based on the following information, generate a comprehensive report for the client:

  Project Name: {{{projectName}}}
  Location: {{{geoLocationInfo.displayName}}} (Lat: {{{geoLocationInfo.location.lat}}}, Lng: {{{geoLocationInfo.location.lng}}})
  Construction Goals: {{{constructionGoals}}}
  Cost Metrics: {{{costMetrics}}}
  Time Metrics: {{{timeMetrics}}}
  Permissions: {{{permissions}}}

  The report should summarize key project details and insights in a professional and easy-to-understand manner.
  `,
});

const generateProjectReportFlow = ai.defineFlow<
  typeof GenerateProjectReportInputSchema,
  typeof GenerateProjectReportOutputSchema
>({
  name: 'generateProjectReportFlow',
  inputSchema: GenerateProjectReportInputSchema,
  outputSchema: GenerateProjectReportOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
