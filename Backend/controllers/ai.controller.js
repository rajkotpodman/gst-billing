import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store in root of workspace and in Backend/logs
const workspaceRoot = path.resolve(__dirname, '../../');
const rootChatFilePath = path.join(workspaceRoot, 'ai_chat_history.txt');
const backendLogsDir = path.resolve(__dirname, '../logs');
const backendChatFilePath = path.join(backendLogsDir, 'ai_chat_history.txt');

// Ensure log directories exist
try {
  if (!fs.existsSync(backendLogsDir)) {
    fs.mkdirSync(backendLogsDir, { recursive: true });
  }
} catch {
  // directory exists or will be created
}

export const saveChat = async (req, res) => {
  try {
    const { agentId, agentName, prompt, response, businessName, gstin } = req.body;
    const userEmail = req.user?.email || 'Jigsi_karia@jigsikaria.com';
    const userName = req.user?.name || 'Jigsi Karia';
    const shopName = businessName || req.user?.shopId?.businessName || 'Aayush Mobile and Computer';
    const shopGstin = gstin || req.user?.shopId?.gstin || '24ABCDE1234F1Z5';

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const divider = '='.repeat(80);
    const subDivider = '-'.repeat(80);

    const logEntry = `
${divider}
TIMESTAMP : ${timestamp}
USER      : ${userName} (${userEmail})
BUSINESS  : ${shopName} | GSTIN: ${shopGstin}
AGENT     : ${agentName || agentId || 'General AI Assistant'} [ID: ${agentId || 'general'}]
${subDivider}
[USER PROMPT]:
${prompt?.trim() || '(empty prompt)'}

[AI RESPONSE]:
${typeof response === 'string' ? response.trim() : JSON.stringify(response, null, 2)}
${divider}
`;

    // Append to workspace root file
    fs.appendFileSync(rootChatFilePath, logEntry, 'utf8');

    // Append to backend logs file
    try {
      fs.appendFileSync(backendChatFilePath, logEntry, 'utf8');
    } catch {
      // safe fallback
    }

    return sendSuccess(res, 200, 'Chat and reply successfully recorded in text file', {
      filePath: rootChatFilePath,
      timestamp,
    });
  } catch (error) {
    console.error('Error saving chat to text file:', error);
    return sendError(res, 500, 'Failed to write chat to text file', error.message);
  }
};

export const getChatHistory = async (_req, res) => {
  try {
    let content = '';
    if (fs.existsSync(rootChatFilePath)) {
      content = fs.readFileSync(rootChatFilePath, 'utf8');
    } else {
      content = `# AI Chat History Log — Aayush Mobile and Computer\n# Created: ${new Date().toISOString()}\n`;
      fs.writeFileSync(rootChatFilePath, content, 'utf8');
    }

    return sendSuccess(res, 200, 'Chat history retrieved', { content });
  } catch (error) {
    return sendError(res, 500, 'Failed to read chat history', error.message);
  }
};

export const downloadChatFile = async (_req, res) => {
  try {
    if (!fs.existsSync(rootChatFilePath)) {
      fs.writeFileSync(
        rootChatFilePath,
        `# AI Chat History Log — Aayush Mobile and Computer\n# Initialized: ${new Date().toISOString()}\n`,
        'utf8'
      );
    }
    return res.download(rootChatFilePath, 'ai_chat_history.txt');
  } catch (error) {
    return sendError(res, 500, 'Failed to download chat file', error.message);
  }
};

/**
 * Intelligent prompt understanding using Gemini API
 */
export const understandPrompt = async (req, res) => {
  try {
    const { prompt, systemPrompt, apiKey, model } = req.body;
    const { understandUserPrompt } = await import('../services/gemini.service.js');
    const result = await understandUserPrompt({ prompt, systemPrompt, apiKey, model });

    return sendSuccess(res, 200, 'Prompt processed', result);
  } catch (error) {
    return sendError(res, 500, 'Failed to process prompt with Gemini API', error.message);
  }
};

export default {
  saveChat,
  getChatHistory,
  downloadChatFile,
  understandPrompt,
};
