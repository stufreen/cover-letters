interface OpenAIApi {
  request: (route: string, params?: any) => Promise<any>;
}

export let openai: OpenAIApi | null = null;

interface InitializeOpenAI {
  organization: string;
  apiKey: string;
}
export function initializeOpenAI({ organization, apiKey }: InitializeOpenAI) {
  function request(route: string, params?: any) {
    return fetch(route, {
      method: params ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Organization': organization,
        'Content-Type': 'application/json',
      },
      body: params ? JSON.stringify(params) : undefined,
    }).then((response) => {
      if (response.status === 200) {
        return response;
      } else {
        console.log(JSON.stringify(response));
        throw new Error(response.statusText);
      }
    });
  }

  openai = {
    request,
  };
}

export function listEngines() {
  return openai?.request('https://api.openai.com/v1/models');
}

interface Completion {
  prompt: string;
}
export function completion({ prompt }: Completion) {
  return openai?.request('https://api.openai.com/v1/completions', { prompt, model: 'text-davinci-003', max_tokens: 1024 });
}

interface Chat {
  messages: {
    role: string;
    content: string;
  }[];
}

export function chat({ messages }: Chat) {
  return openai?.request('https://api.openai.com/v1/chat/completions', { messages, model: 'gpt-3.5-turbo', stream: true });
}
