import { chat, completion, initializeOpenAI, listEngines } from './openAi';
import { createChatPrompt, createPrompt } from './prompt';
import * as testData from './test/dropbox.json';

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

    // const prompt = createPrompt({
    //   jobDescription: testData.jobDescription,
    //   qualifications: testData.qualifications,
    //   tone: 'Professional and energetic',
    //   companyName: testData.companyName,
    // });

    const messages = createChatPrompt({
      jobDescription: testData.jobDescription,
      qualifications: testData.qualifications,
      tone: 'casual, clever, brief and fun',
      companyName: testData.companyName,
    });

    const openAIResponse = await chat({ messages });

    return new Response(openAIResponse.choices[0].message.content);
  },
};
