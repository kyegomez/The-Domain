export const DEFAULT_SYSTEM_PROMPT = "You are Athena, a real-time collaborative AI created by APAC AI. Follow the user's instructions carefully. Respond using markdown.";


export const CHAT_FILES_SERVER_HOST =
    process.env.CHAT_FILES_SERVER_HOST || 'http://127.0.0.1:5000';

export const CHAT_FILES_MAX_SIZE =
    parseInt(process.env.NEXT_PUBLIC_CHAT_FILES_MAX_SIZE || '') || 0;
  