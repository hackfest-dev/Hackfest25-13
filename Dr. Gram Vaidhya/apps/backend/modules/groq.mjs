import dotenv from "dotenv";
import { z } from "zod";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const knowledgeBasePath = path.join(__dirname, '../data/KnowledgeBase.csv');

// Load and parse the knowledge base
const knowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf-8')
  .split('\n')
  .slice(1) // Skip header
  .map(line => {
    const [_, diseaseCode, disease, symptomCode, symptom, weight, noise] = line.split(',');
    return {
      diseaseCode,
      disease,
      symptom,
      weight: parseFloat(weight),
      noise: parseFloat(noise)
    };
  })
  .filter(entry => entry.disease && entry.symptom);

// Create a symptom lookup map for faster matching
const symptomLookup = knowledgeBase.reduce((acc, entry) => {
  if (!acc[entry.symptom.toLowerCase()]) {
    acc[entry.symptom.toLowerCase()] = [];
  }
  acc[entry.symptom.toLowerCase()].push(entry);
  return acc;
}, {});

// Group symptoms by disease for reference
const diseaseSymptoms = knowledgeBase.reduce((acc, entry) => {
  if (!acc[entry.disease]) {
    acc[entry.disease] = [];
  }
  acc[entry.disease].push({
    symptom: entry.symptom,
    weight: entry.weight,
    noise: entry.noise
  });
  return acc;
}, {});

const messageSchema = z.object({
  messages: z.array(
    z.object({
      text: z.string(),
      facialExpression: z.enum(['smile', 'sad', 'angry', 'surprised', 'funnyFace', 'default']),
      animation: z.enum([
        'Idle', 'TalkingOne', 'TalkingThree', 'SadIdle', 'Defeated', 
        'Angry', 'Surprised', 'DismissingGesture', 'ThoughtfulHeadShake'
      ]),
      type: z.enum(['question', 'diagnosis', 'information']).optional(),
      probabilities: z.array(z.object({
        disease: z.string(),
        probability: z.number(),
        matchingSymptoms: z.array(z.string()).optional()
      })).optional()
    })
  )
});

const systemPrompt = `You are Dr. Vaidya, a knowledgeable and empathetic healthcare AI assistant specializing in diagnostic conversations. You must respond in this exact JSON format:

{
  "messages": [
    {
      "text": "Your response here",
      "facialExpression": "smile",
      "animation": "TalkingOne",
      "type": "question",
      "probabilities": [
        {
          "disease": "Disease Name",
          "probability": 0.75,
          "matchingSymptoms": ["symptom1", "symptom2"]
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. NEVER provide a diagnosis in the first 2 exchanges
2. ALWAYS ask follow-up questions about symptoms
3. NEVER repeat the same question twice
4. After asking 3-4 different questions and getting answers, you MUST provide a diagnosis
5. If the user denies having additional symptoms after 3-4 questions, make a diagnosis based on the symptoms they have confirmed

Guidelines for responses:
1. Maintain a professional yet empathetic tone
2. Follow-up questions MUST cover (but don't repeat if already asked):
   - Duration and severity of symptoms (e.g., "How long have you had the fever?")
   - Associated symptoms (e.g., "Do you have any other symptoms like cough or sore throat?")
   - Any recent changes in health (e.g., "Have you been feeling this way for a while or did it start suddenly?")
   - Relevant medical history (e.g., "Do you have any chronic conditions?")
   - Current medications (e.g., "Are you taking any medications?")
3. Use the provided knowledge base to inform your questions
4. When providing a diagnosis, include:
   - Clear diagnosis statement
   - Confidence level
   - Supporting symptoms
   - Next steps/recommendations
5. Always include matching symptoms with probabilities
6. Format probabilities as percentages in the text response
7. Use appropriate facial expressions:
   smile: for general questions and positive findings
   sad: for discussing serious symptoms
   surprised: for important findings
   angry: for health risks
   default: for neutral information
8. Match animations with content:
   TalkingOne: general questions
   TalkingThree: important findings
   Idle: transitions
   SadIdle: discussing serious symptoms
   Defeated: discussing poor prognosis
   Surprised: important findings
   Angry: health risks
   DismissingGesture: correcting misinformation
   ThoughtfulHeadShake: complex medical topics

Response types:
- question: When asking follow-up questions
- diagnosis: When providing a probable diagnosis (after 3-4 questions)
- information: When providing general health information

Always maintain conversation context and build upon previous symptoms mentioned.`;

function calculateProbabilities(symptoms) {
  const probabilities = {};
  const totalWeight = {};
  const matchingSymptoms = {};
  
  // Calculate initial probabilities based on symptom matches
  symptoms.forEach(symptom => {
    const normalizedSymptom = symptom.toLowerCase();
    const matches = symptomLookup[normalizedSymptom] || [];
    
    matches.forEach(entry => {
      if (!probabilities[entry.disease]) {
        probabilities[entry.disease] = 0;
        totalWeight[entry.disease] = 0;
        matchingSymptoms[entry.disease] = [];
      }
      
      // Apply weight and noise factors
      const adjustedWeight = entry.weight * (1 - entry.noise);
      probabilities[entry.disease] += adjustedWeight;
      totalWeight[entry.disease] += entry.weight;
      matchingSymptoms[entry.disease].push({
        symptom: entry.symptom,
        weight: entry.weight,
        adjustedWeight
      });
    });
  });

  // Normalize probabilities and include matching symptoms
  const normalizedProbabilities = Object.entries(probabilities)
    .map(([disease, score]) => {
      const total = totalWeight[disease];
      const probability = total > 0 ? score / total : 0;
      
      // Sort matching symptoms by adjusted weight
      const sortedSymptoms = matchingSymptoms[disease]
        .sort((a, b) => b.adjustedWeight - a.adjustedWeight)
        .map(s => s.symptom);
      
      return {
        disease,
        probability,
        matchingSymptoms: sortedSymptoms,
        totalWeight: total,
        score
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .filter(entry => entry.probability > 0.1); // Only include significant probabilities

  return normalizedProbabilities;
}

function formatProbabilities(probabilities) {
  if (!probabilities || probabilities.length === 0) {
    return "Based on your symptoms, I don't have enough information to make a prediction yet.";
  }

  const topProbabilities = probabilities.slice(0, 3); // Show top 3 predictions
  
  // Check if we have a high-confidence diagnosis
  const highConfidenceDiagnosis = topProbabilities.find(p => p.probability >= 0.7);
  
  if (highConfidenceDiagnosis) {
    return `Based on your symptoms, I can provide a diagnosis:
    
DIAGNOSIS: ${highConfidenceDiagnosis.disease}
CONFIDENCE: ${(highConfidenceDiagnosis.probability * 100).toFixed(1)}%
SUPPORTING SYMPTOMS: ${highConfidenceDiagnosis.matchingSymptoms.join(', ')}

Other possible conditions:
${topProbabilities
  .filter(p => p !== highConfidenceDiagnosis)
  .map(p => `${p.disease}: ${(p.probability * 100).toFixed(1)}%`)
  .join('\n')}`;
  }

  return `Based on your symptoms, here are the potential diagnoses:
${topProbabilities.map(p => 
  `${p.disease}: ${(p.probability * 100).toFixed(1)}% (matching symptoms: ${p.matchingSymptoms.join(', ')})`
).join('\n')}

I need more information to make a definitive diagnosis.`;
}

function cleanTextForSpeech(text) {
  return text
    .replace(/\\n/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\*\*/g, '')
    .replace(/\([^)]+\)/g, '')
    .replace(/e\.g\.,?/g, 'for example')
    .replace(/i\.e\.,?/g, 'that is')
    .replace(/:\s+/g, '. ')
    .replace(/\s*-\s*/g, '. ')
    .replace(/\s+/g, ' ')
    .replace(/\.+/g, '.')
    .replace(/\.\s+/g, '. ')
    .replace(/\s+\./g, '.')
    .replace(/^\.|\.$/g, '')
    .replace(/\s+/g, ' ')
    .trim() + '.';
}

async function generateResponse(userMessage, conversationHistory = []) {
  try {
    // Extract symptoms from conversation history
    const symptoms = conversationHistory
      .filter(msg => msg.role === 'user')
      .flatMap(msg => {
        // Match against our knowledge base symptoms
        const normalizedMessage = msg.content.toLowerCase();
        return Object.keys(symptomLookup)
          .filter(symptom => normalizedMessage.includes(symptom))
          .map(symptom => symptomLookup[symptom][0].symptom); // Use canonical symptom name
      });

    // Calculate current probabilities
    const currentProbabilities = calculateProbabilities(symptoms);

    console.log('Making request to Groq API...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          ...conversationHistory,
          { 
            role: 'user', 
            content: `Current symptoms: ${symptoms.join(', ')}. User message: ${userMessage}. Current probabilities: ${formatProbabilities(currentProbabilities)}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 429) {
        return {
          messages: [{
            text: "I'm receiving too many requests. Please wait a moment.",
            facialExpression: "sad",
            animation: "Defeated",
            type: "information"
          }]
        };
      }
      return {
        messages: [{
          text: `I encountered an error (${response.status}): ${errorData.error?.message || 'Please try again'}`,
          facialExpression: "sad",
          animation: "SadIdle",
          type: "information"
        }]
      };
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      return {
        messages: [{
          text: "I received an invalid response. Please try again.",
          facialExpression: "sad",
          animation: "Defeated",
          type: "information"
        }]
      };
    }

    const content = data.choices[0].message.content.trim();
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          messages: [{
            text: cleanTextForSpeech(content),
            facialExpression: "default",
            animation: "TalkingOne",
            type: "information"
          }]
        };
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      if (!parsedResponse.messages || !Array.isArray(parsedResponse.messages)) {
        return {
          messages: [{
            text: cleanTextForSpeech(content),
            facialExpression: "default",
            animation: "TalkingOne",
            type: "information"
          }]
        };
      }

      // Add probabilities to the response
      parsedResponse.messages = parsedResponse.messages.map(msg => ({
        text: cleanTextForSpeech(msg.text || "I'm not sure what to say."),
        facialExpression: ['smile', 'sad', 'angry', 'surprised', 'funnyFace', 'default'].includes(msg.facialExpression) 
          ? msg.facialExpression 
          : 'default',
        animation: ['Idle', 'TalkingOne', 'TalkingThree', 'SadIdle', 'Defeated', 'Angry', 'Surprised', 'DismissingGesture', 'ThoughtfulHeadShake'].includes(msg.animation)
          ? msg.animation
          : 'TalkingOne',
        type: msg.type || 'information',
        probabilities: currentProbabilities
      }));

      return parsedResponse;
    } catch (error) {
      return {
        messages: [{
          text: cleanTextForSpeech(content),
          facialExpression: "default",
          animation: "TalkingOne",
          type: "information"
        }]
      };
    }
  } catch (error) {
    return {
      messages: [{
        text: "I'm having trouble connecting. Please try again.",
        facialExpression: "sad",
        animation: "Defeated",
        type: "information"
      }]
    };
  }
}

export { generateResponse }; 