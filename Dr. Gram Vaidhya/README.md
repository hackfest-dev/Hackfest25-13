# Healthcare Digital Assistant with AI

This project implements a digital healthcare assistant avatar that can converse in multiple Indian languages using voice or text input. It leverages Groq's LLM for response generation, Sarvam AI's services for text-to-speech and translation, and Rhubarb Lip Sync for lip synchronization.

## Features

- **Multilingual Support**: Supports 11 Indian languages:
  - English (en-IN)
  - Hindi (hi-IN)
  - Bengali (bn-IN)
  - Kannada (kn-IN)
  - Malayalam (ml-IN)
  - Marathi (mr-IN)
  - Odia (od-IN)
  - Punjabi (pa-IN)
  - Tamil (ta-IN)
  - Telugu (te-IN)
  - Gujarati (gu-IN)

- **Healthcare Features**:
  - General health information and education
  - Symptom explanation and guidance
  - Health and wellness tips
  - Medication reminders and information
  - Lifestyle recommendations
  - Preventive care information
  - Mental health support
  - First aid guidance
  - Health risk assessments
  - Medical terminology explanation

- **Multiple Input Methods**:
  - Text input with real-time translation
  - Voice input with speech recognition
  - Language selection through an easy-to-use dropdown

- **Conversation Features**:
  - Real-time chat history with timestamp
  - Pop-up chat interface
  - Original text preservation for translations
  - Clear conversation history option
  - Persistent chat history across sessions

- **Professional Avatar**:
  - 3D healthcare professional avatar with lip synchronization
  - Appropriate facial expressions for healthcare context
  - Professional demeanor
  - Empathetic communication style
  - Clear and confident delivery

- **Language Processing**:
  - Automatic language detection
  - Real-time translation
  - Context-aware responses
  - Medical terminology understanding
  - Preservation of conversation context

## System Architecture

The system operates through two primary workflows:

### Text Input Workflow:
1. User selects language and enters health-related query
2. Text is translated to English if not already in English
3. Groq LLM generates a medically appropriate response
4. Response is translated to the selected language
5. Sarvam AI converts text to speech
6. Rhubarb Lip Sync generates lip sync data
7. Avatar speaks the response with synchronized lip movements
8. Conversation is logged in the chat history

### Voice Input Workflow:
1. User selects language and speaks their health query
2. Speech is recognized in the selected language
3. Recognized text is translated to English if needed
4. Groq LLM generates a medically appropriate response
5. Response is translated to the selected language
6. Sarvam AI converts text to speech
7. Rhubarb Lip Sync generates lip sync data
8. Avatar speaks the response with synchronized lip movements
9. Conversation is logged in the chat history

## Requirements

1. **Groq API Key**: Sign up at [Groq Cloud](https://console.groq.com) to get your API key.
2. **Sarvam AI API Key**: Register at [Sarvam AI](https://sarvam.ai) to get your API key.
3. **Rhubarb Lip-Sync**: Download the latest version from [Rhubarb Lip-Sync releases](https://github.com/DanielSWolf/rhubarb-lip-sync/releases).
   - Create a `/apps/backend/bin` directory
   - Extract the downloaded zip and copy all files to the bin directory
   - Ensure proper permissions are set

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare-digital-assistant
```

2. Install dependencies:
```bash
yarn
```

3. Create `/apps/backend/.env` with your API keys:
```bash
# Groq
GROQ_API_KEY=<your-groq-api-key>

# Sarvam AI
SARVAM_API_KEY=<your-sarvam-api-key>
```

4. Set up Rhubarb Lip-Sync:
- Download the appropriate version for your OS
- Create `/apps/backend/bin` directory
- Copy Rhubarb files to the bin directory

5. Start the development servers:
```bash
# Start backend server (default port: 3000)
cd apps/backend
npm run dev

# Start frontend application (default port: 5175)
cd apps/frontend
npm run dev
```

The application will be available at [http://localhost:5175](http://localhost:5175).

## Usage

1. Open the application in your browser
2. Select your preferred language from the dropdown
3. Either:
   - Type your health-related question and click send, or
   - Click the microphone icon and speak your query
4. The healthcare avatar will respond in the selected language with synchronized lip movements
5. View conversation history by clicking the chat icon in the bottom right
6. Clear conversation history using the "Clear" button in the chat panel

## Technical Details

- **Frontend**: 
  - React with Three.js for 3D rendering
  - TailwindCSS for styling
  - Custom hooks for state management
  - WebSpeech API for voice recognition

- **Backend**: 
  - Node.js with Express
  - File system management for audio processing
  - WebSocket for real-time communication

- **AI Services**:
  - Groq LLM for healthcare response generation
  - Sarvam AI for:
    - Text-to-speech in Indian languages
    - Translation services
    - Speech recognition
    - Language detection
    - Text analytics

- **Animation**: 
  - Professional healthcare avatar with custom animations
  - Appropriate facial expressions for healthcare context
  - Professional demeanor
  - Empathetic communication style

- **Lip Sync**: 
  - Rhubarb Lip Sync for viseme generation
  - Real-time audio synchronization

## Project Structure

```
healthcare-digital-assistant/
├── apps/
│   ├── frontend/           # React frontend application
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   └── constants/ # Configuration files
│   │   └── public/        # Static assets
│   └── backend/           # Node.js backend server
│       ├── modules/       # Backend service modules
│       ├── bin/          # Rhubarb Lip Sync binaries
│       ├── audios/       # Generated audio files
│       └── tmp/          # Temporary files
└── package.json          # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Important Disclaimer

This application is designed to provide general health information and education. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or heard from this application.
