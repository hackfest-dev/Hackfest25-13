import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { generateResponse } from "./modules/groq.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages, defaultResponse } from "./modules/defaultMessages.mjs";
import { translateText, transliterateText } from "./modules/sarvamTranslate.mjs";
import { speechToText, speechToTextTranslate } from "./modules/sarvamSpeechToText.mjs";
import { detectLanguage, analyzeText } from "./modules/sarvamTextAnalytics.mjs";
import { conversationManager } from "./modules/conversationManager.mjs";
import { mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Create necessary directories
const directories = ['tmp', 'audios'];
directories.forEach(dir => {
  const dirPath = join(process.cwd(), dir);
  try {
    mkdirSync(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error(`Error creating ${dir} directory:`, err);
    }
  }
});

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
const port = 3000;

// Store conversation history
const conversations = new Map();

// Helper function to translate messages
async function translateMessages(messages, targetLanguage) {
  const translatedMessages = [];
  for (const message of messages) {
    try {
      // First detect the language of the message
      const detectedLanguage = await detectLanguage(message.text);
      
      // Only translate if source and target languages are different
      if (detectedLanguage !== targetLanguage) {
        const translatedText = await translateText({
          text: message.text,
          sourceLanguage: detectedLanguage,
          targetLanguage
        });
        
        translatedMessages.push({
          ...message,
          text: translatedText,
          originalText: message.text,
          detectedLanguage
        });
      } else {
        // If same language, no translation needed
        translatedMessages.push({
          ...message,
          originalText: message.text,
          detectedLanguage
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      translatedMessages.push(message); // Use original message if translation fails
    }
  }
  return translatedMessages;
}

// New endpoint for speech-to-text with automatic language detection
app.post("/speech-to-text", async (req, res) => {
  try {
    const { audioData, targetLanguage = 'en-IN' } = req.body;
    
    if (!audioData) {
      res.status(400).send({ error: 'No audio data provided' });
      return;
    }

    // First convert speech to text in original language
    const transcribedText = await speechToText({ audioData });
    
    // Detect the language of the transcribed text
    const detectedLanguage = await detectLanguage(transcribedText);
    
    // If target language is different from detected language, translate
    let finalText = transcribedText;
    let translatedText = null;
    
    if (detectedLanguage !== targetLanguage) {
      const result = await speechToTextTranslate({
        audioData,
        sourceLanguage: detectedLanguage,
        targetLanguage
      });
      finalText = result.translatedText;
      translatedText = result.originalText;
    }
    
    // Analyze sentiment of the text
    const sentiment = await analyzeText(finalText);
    
    res.send({
      originalText: transcribedText,
      translatedText,
      detectedLanguage,
      targetLanguage,
      sentiment,
      success: true
    });
  } catch (error) {
    console.error('Error in speech-to-text endpoint:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Text input endpoint
app.post("/tts", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const languageCode = req.body.languageCode;
    const sessionId = req.body.sessionId || uuidv4();
    
    if (!userMessage) {
      res.status(400).send({ error: 'No message provided' });
      return;
    }

    console.log('Received text input:', userMessage);
    console.log('Target language:', languageCode);
    console.log('Session ID:', sessionId);

    // Add user message to conversation history
    conversationManager.addMessage(sessionId, 'user', userMessage);

    // Get conversation history
    const conversationHistory = conversationManager.getContextForAPI(sessionId);

    // Get AI response (it will be in English)
    let aiResponse;
    try {
      // If input is not in English, first translate it to English
      let englishQuery = userMessage;
      if (languageCode !== 'en-IN') {
        englishQuery = await translateText({
          text: userMessage,
          sourceLanguage: languageCode,
          targetLanguage: 'en-IN'
        });
      }
      console.log('English query for AI:', englishQuery);
      aiResponse = await generateResponse(englishQuery, conversationHistory);
    } catch (error) {
      console.error('Error generating response:', error);
      aiResponse = defaultResponse;
    }

    // Add AI response to conversation history
    aiResponse.messages.forEach(message => {
      conversationManager.addMessage(sessionId, 'assistant', message.text);
    });

    try {
      // Translate AI response to target language
      const translatedMessages = await Promise.all(
        aiResponse.messages.map(async (message) => {
          try {
            // Only translate if target language is not English
            if (languageCode !== 'en-IN') {
              const translatedText = await translateText({
                text: message.text,
                sourceLanguage: 'en-IN',
                targetLanguage: languageCode
              });

              return {
                ...message,
                text: translatedText,
                originalText: message.text
              };
            }
            return {
              ...message,
              originalText: message.text
            };
          } catch (error) {
            console.error('Translation error:', error);
            return message;
          }
        })
      );

      // Process with lip sync
      const processedResponse = await lipSync({
        messages: translatedMessages,
        languageCode: languageCode.split('-')[0] // Extract language code without region
      });

      res.send({
        messages: processedResponse,
        targetLanguage: languageCode,
        sessionId,
        success: true
      });
    } catch (error) {
      console.error('Error in translation/lip-sync:', error);
      // Fallback to English response
      const processedResponse = await lipSync({
        messages: aiResponse.messages,
        languageCode: 'en'
      });

      res.send({
        messages: processedResponse,
        targetLanguage: 'en-IN',
        sessionId,
        success: true,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Error in tts endpoint:', error);
    res.status(500).send({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Voice input endpoint
app.post("/voice-input", async (req, res) => {
  try {
    const { text, languageCode, sessionId: providedSessionId } = req.body;
    const sessionId = providedSessionId || uuidv4();
    
    if (!text) {
      res.status(400).send({ error: 'No text provided' });
      return;
    }

    console.log('Received voice input text:', text);
    console.log('Target language:', languageCode);
    console.log('Session ID:', sessionId);

    // Add user message to conversation history
    conversationManager.addMessage(sessionId, 'user', text);

    // Get conversation history
    const conversationHistory = conversationManager.getContextForAPI(sessionId);

    // Get AI response (it will be in English)
    let aiResponse;
    try {
      // If input is not in English, first translate it to English
      let englishQuery = text;
      if (languageCode !== 'en-IN') {
        englishQuery = await translateText({
          text,
          sourceLanguage: languageCode,
          targetLanguage: 'en-IN'
        });
      }
      console.log('English query for AI:', englishQuery);
      aiResponse = await generateResponse(englishQuery, conversationHistory);
    } catch (error) {
      console.error('Error generating response:', error);
      aiResponse = defaultResponse;
    }

    // Add AI response to conversation history
    aiResponse.messages.forEach(message => {
      conversationManager.addMessage(sessionId, 'assistant', message.text);
    });

    try {
      // Translate AI response to target language
      const translatedMessages = await Promise.all(
        aiResponse.messages.map(async (message) => {
          try {
            // Only translate if target language is not English
            if (languageCode !== 'en-IN') {
              const translatedText = await translateText({
                text: message.text,
                sourceLanguage: 'en-IN',
                targetLanguage: languageCode
              });

              return {
                ...message,
                text: translatedText,
                originalText: message.text
              };
            }
            return {
              ...message,
              originalText: message.text
            };
          } catch (error) {
            console.error('Translation error:', error);
            return message;
          }
        })
      );

      // Process with lip sync
      const processedResponse = await lipSync({
        messages: translatedMessages,
        languageCode: languageCode.split('-')[0] // Extract language code without region
      });

      res.send({
        messages: processedResponse,
        targetLanguage: languageCode,
        sessionId,
        success: true
      });
    } catch (error) {
      console.error('Error in translation/lip-sync:', error);
      // Fallback to English response
      const processedResponse = await lipSync({
        messages: aiResponse.messages,
        languageCode: 'en'
      });

      res.send({
        messages: processedResponse,
        targetLanguage: 'en-IN',
        sessionId,
        success: true,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Error in voice-input endpoint:', error);
    res.status(500).send({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Add endpoint to clear conversation history
app.post("/clear-conversation", (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).send({ error: 'No session ID provided' });
      return;
    }
    conversationManager.clearConversation(sessionId);
    res.send({ success: true });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get or create conversation history
    let conversationHistory = conversations.get(conversationId) || [];
    
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Generate response with conversation history
    const response = await generateResponse(message, conversationHistory);
    
    // Add assistant response to history
    conversationHistory.push({
      role: 'assistant',
      content: response.messages[0].text
    });

    // Update conversation history
    conversations.set(conversationId, conversationHistory);

    res.json(response);
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Amol AI is listening on port ${port}`);
});
