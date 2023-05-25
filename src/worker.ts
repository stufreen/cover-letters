import { chat, completion, initializeOpenAI, openai } from './openAi';
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
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Max-Age': '86400',
    };

    async function handleOptions(request: Request) {
      if (
        request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null
      ) {
        // Handle CORS preflight requests.
        return new Response(null, {
          headers: {
            ...corsHeaders,
            'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') ?? '',
          },
        });
      } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
          headers: {
            Allow: 'GET, HEAD, POST, OPTIONS',
          },
        });
      }
    }

    if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      return handleOptions(request);
    }

    initializeOpenAI({ organization: env.OPENAI_API_ORGANIZATION, apiKey: env.OPENAI_API_KEY });

    if (!request.body) {
      throw new Error('Missing body');
    }

    const bodyParsed = await readBody(request.body);

    const { jobDescription, qualifications, companyName } = bodyParsed;

    if (!jobDescription || !qualifications || !companyName) {
      throw new Error('Incorrect parameters');
    }

    const messages = createChatPrompt({
      jobDescription,
      qualifications,
      tone: 'casual, clever, and brief',
      companyName,
    });

    let { readable, writable } = new TransformStream();

    const openAIResponse = await chat({ messages });

    openAIResponse.body.pipeTo(writable);

    return new Response(readable, {
      status: 200,
      statusText: 'ok',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
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
