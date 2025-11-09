import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Interface for incoming chat API request payload
 */
interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  resultContext: {
    completionDate: string;
    potentialProblems: string[];
    adviceLists: Array<{
      problem: string;
      advices: string[];
    }>;
  };
}

/**
 * Mapping of problem codes to their full names in English and Ukrainian
 */
const PROBLEM_NAMES: Record<string, string> = {
  SS: 'Suicidal Syndrome (Суїцидальний синдром)',
  CTSD: 'Chronic Traumatic Stress Disorder (Хронічний травматичний стресовий розлад)',
  PTSD: 'Post-Traumatic Stress Disorder (Посттравматичний стресовий розлад)',
  MT: 'Moral Injury/Trauma (Моральна травма)',
  PCS: 'Post-Concussion Syndrome (Постконтузійний синдром)',
  PTS: 'Post-Traumatic Symptom (Посттравматичний симптом)',
  A: 'Anxiety (Тривога)',
  D: 'Discomfort (Дискомфорт)',
  N: 'Normal (Норма)',
};

/**
 * OpenAI API configuration constants
 */
const OPENAI_CONFIG = {
  MODEL: 'gpt-4-turbo-preview',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
} as const;

/**
 * Vite plugin that provides a chat API endpoint for OpenAI integration
 *
 * This plugin creates a POST endpoint at /api/chat that handles chat requests
 * with context from PTSD evaluation results. It integrates with OpenAI's API
 * to provide contextual responses based on user assessment data.
 *
 * @returns {Plugin} Vite plugin configuration
 */
export function chatApiPlugin(): Plugin {
  let config: any;

  return {
    name: 'chat-api',

    /**
     * Store resolved Vite configuration for accessing environment variables
     */
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    /**
     * Configure development server with chat API middleware
     */
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          await handleChatRequest(req, res, config);
        } else {
          next();
        }
      });
    },
  };
}

/**
 * Handle incoming chat API requests
 *
 * @param {IncomingMessage} req - HTTP request object
 * @param {ServerResponse} res - HTTP response object
 * @param {any} config - Vite configuration object
 */
async function handleChatRequest(req: IncomingMessage, res: ServerResponse, config: any): Promise<void> {
  try {
    const body = await parseRequestBody(req);
    const { messages, resultContext } = JSON.parse(body) as ChatRequest;

    // Dynamically import OpenAI to avoid bundling issues
    const { default: OpenAI } = await import('openai');

    // Validate and retrieve API key
    const apiKey = getEnvironmentVariable(config, 'OPENAI_API_KEY');
    if (!apiKey) {
      return sendErrorResponse(
        res,
        500,
        'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.'
      );
    }

    // Validate and retrieve Prompt ID
    const promptId = getEnvironmentVariable(config, 'OPENAI_PROMPT_ID');
    if (!promptId) {
      return sendErrorResponse(
        res,
        500,
        'OpenAI Prompt ID not configured. Please add VITE_OPENAI_PROMPT_ID to your .env file.'
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Build context message from evaluation results
    const contextMessage = buildContextMessage(resultContext);

    // Request completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: `prompt:${promptId}`,
        },
        {
          role: 'user',
          content: contextMessage,
        },
        ...messages,
      ],
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      temperature: OPENAI_CONFIG.TEMPERATURE,
    });

    const responseMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    sendSuccessResponse(res, { message: responseMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    sendErrorResponse(res, 500, errorMessage);
  }
}

/**
 * Parse request body from incoming stream
 *
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<string>} Parsed request body
 */
function parseRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Retrieve environment variable with fallback options
 *
 * @param {any} config - Vite configuration object
 * @param {string} variableName - Base name of the environment variable
 * @returns {string | undefined} Environment variable value
 */
function getEnvironmentVariable(config: any, variableName: string): string | undefined {
  const viteKey = `VITE_${variableName}`;
  return config.env[viteKey] || process.env[viteKey] || process.env[variableName];
}

/**
 * Build context message from evaluation results
 *
 * @param {ChatRequest['resultContext']} resultContext - User evaluation results
 * @returns {string} Formatted context message for OpenAI
 */
function buildContextMessage(resultContext: ChatRequest['resultContext']): string {
  const problemsWithNames = resultContext.potentialProblems
    .map((code) => `${code} (${PROBLEM_NAMES[code] || code})`)
    .join(', ');

  const problemReference = Object.entries(PROBLEM_NAMES)
    .map(([code, name]) => `- ${code}: ${name}`)
    .join('\n');

  const adviceSection = resultContext.adviceLists
    .map(
      (list) => `
Problem: ${list.problem}
Advice:
${list.advices.map((advice) => `- ${advice}`).join('\n')}`
    )
    .join('\n');

  return `The user has completed a PTSD evaluation with the following results:
- Completion Date: ${resultContext.completionDate}
- Potential Problems Identified: ${problemsWithNames}

Problem Code Reference:
${problemReference}

Advice Lists:
${adviceSection}`;
}

/**
 * Send successful JSON response
 *
 * @param {ServerResponse} res - HTTP response object
 * @param {object} data - Response data to send
 */
function sendSuccessResponse(res: ServerResponse, data: object): void {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Send error JSON response
 *
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {string} errorMessage - Error message
 */
function sendErrorResponse(res: ServerResponse, statusCode: number, errorMessage: string): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: errorMessage }));
}
