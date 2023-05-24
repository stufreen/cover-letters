interface CreatePrompt {
  jobDescription: string;
  qualifications: string;
  companyName: string;
  tone: string;
}

export function createPrompt({ jobDescription, qualifications, companyName, tone }: CreatePrompt) {
  return `
    You are writing me a cover letter for a job application. Write a cover letter body for ${companyName}.
    
    It should be 3-5 paragraphs long and written in a ${tone} tone.

    The job description is: ${jobDescription}

    My qualifications are: ${qualifications}
  `;
}

export function createChatPrompt({ jobDescription, qualifications, companyName, tone }: CreatePrompt) {
  return [
    {
      role: 'user',
      content: `Write a cover letter body for ${companyName}. It should be 2-3 paragraphs long and written in a ${tone} tone. The cover letter should highlight areas where my qualifications match the job description. Don't mention areas where my qualifications are not part of the job description.`,
    },
    {
      role: 'user',
      content: `The job description is: ${jobDescription}`,
    },
    {
      role: 'user',
      content: `My qualifications are: ${qualifications}`,
    },
  ];
}
