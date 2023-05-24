import { chat, completion, initializeOpenAI } from './openAi';
import { createChatPrompt, createPrompt } from './prompt';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  OPENAI_API_ORGANIZATION: string;
  OPENAI_API_KEY: string;
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    initializeOpenAI({ organization: env.OPENAI_API_ORGANIZATION, apiKey: env.OPENAI_API_KEY });

    if (!request.body) {
      throw new Error('Missing body');
    }

    const bodyParsed = await readBody(request.body);

    const { jobDescription, qualifications, companyName } = bodyParsed;

    if (!jobDescription || !qualifications || !companyName) {
      throw new Error('Incorrect parameters');
    }

    // const prompt = createPrompt({
    //   jobDescription,
    //   qualifications,
    //   tone: 'casual, clever, brief and fun',
    //   companyName,
    // });

    // const openAIResponse = await completion({ prompt });

    // return new Response(openAIResponse.choices[0].text);

    const messages = createChatPrompt({
      jobDescription,
      qualifications,
      tone: 'casual, clever, brief and fun',
      companyName,
    });

    const openAIResponse = await chat({ messages });

    return new Response(openAIResponse.choices[0].message.content);
  },
};

async function readBody(rs: ReadableStream) {
  let body = '';
  let utf8decoder = new TextDecoder();
  for await (const chunk of rs) {
    body += utf8decoder.decode(chunk);
  }
  return JSON.parse(body);
}
