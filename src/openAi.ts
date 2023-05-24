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
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'OpenAI-Organization': organization,
      },
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log(response);
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
