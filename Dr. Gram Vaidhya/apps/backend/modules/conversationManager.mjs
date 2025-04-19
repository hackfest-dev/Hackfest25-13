import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conversationsDir = path.join(__dirname, '../data/conversations');

// Ensure conversations directory exists
if (!fs.existsSync(conversationsDir)) {
  fs.mkdirSync(conversationsDir, { recursive: true });
}

class ConversationManager {
  constructor() {
    this.conversations = new Map();
  }

  // Get or create a conversation
  getConversation(sessionId) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, []);
    }
    return this.conversations.get(sessionId);
  }

  // Add a message to the conversation
  addMessage(sessionId, role, content) {
    const conversation = this.getConversation(sessionId);
    conversation.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    this.saveConversation(sessionId);
    return conversation;
  }

  // Get conversation history
  getHistory(sessionId) {
    return this.getConversation(sessionId);
  }

  // Save conversation to file
  saveConversation(sessionId) {
    const conversation = this.getConversation(sessionId);
    const filePath = path.join(conversationsDir, `${sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
  }

  // Load conversation from file
  loadConversation(sessionId) {
    const filePath = path.join(conversationsDir, `${sessionId}.json`);
    if (fs.existsSync(filePath)) {
      const conversation = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.conversations.set(sessionId, conversation);
      return conversation;
    }
    return [];
  }

  // Clear conversation
  clearConversation(sessionId) {
    this.conversations.delete(sessionId);
    const filePath = path.join(conversationsDir, `${sessionId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Get conversation context for API
  getContextForAPI(sessionId) {
    const conversation = this.getConversation(sessionId);
    return conversation.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}

export const conversationManager = new ConversationManager(); 