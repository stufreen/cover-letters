import { lengthToWords } from './lengthToWords';

interface CreatePrompt {
  jobDescription: string;
  qualifications: string;
  companyName: string;
  tone: string;
  length: string;
}

export function createPrompt({ jobDescription, qualifications, companyName, tone }: CreatePrompt) {
  return `
    Write a cover letter body for ${companyName}. It should be two paragraphs long and written in a ${tone} tone. The cover letter should highlight areas where my qualifications match the job description. Don't mention areas where my qualifications are not part of the job description.

    The job description is: ${jobDescription}

    My qualifications are: ${qualifications}
  `;
}

export function createChatPrompt({ jobDescription, qualifications, companyName, tone, length }: CreatePrompt) {
  const words = lengthToWords(length);
  return [
    {
      role: 'system',
      content: `Write a cover letter body for ${companyName}. It must be written in a ${tone} tone. The cover letter should only highlight areas where my qualifications match the job description. Your response must be approximately ${words} words long and should have multiple paragraphs, if necessary.`,
    },
    {
      role: 'user',
      content: `The job description is: \n\n"""\n${jobDescription}\n"""`,
    },
    {
      role: 'user',
      content: `My qualifications are: \n\n"""\n${qualifications}\n"""`,
    },
  ];
}
