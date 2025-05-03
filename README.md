# Wisdom Loop: AI Escalation Knowledge Service

A human-in-the-loop system for AI agents that allows them to escalate questions to human supervisors when they don't have sufficient knowledge to answer that also learns from it.

## Project Overview

This system enables an AI receptionist for a salon to handle customer inquiries and, when it encounters questions it cannot answer, escalate them to a human supervisor. The supervisor can provide answers through a web interface, which are then stored in a knowledge base for future use.

### Key Features

- **LiveKit-powered AI Agent**: Voice-based AI receptionist with natural language processing capabilities
- **Knowledge Base Management**: MongoDB-based storage with vector search for semantic matching
- **Human-in-the-Loop System**: Seamless escalation to human supervisors for unknown queries
- **Supervisor Dashboard**: React-based web interface for handling escalated questions
- **Automatic Learning**: Knowledge base that grows and improves with each supervisor interaction

## System Architecture

The project consists of three main components:

1. **Backend Server**: Handles API requests, database interactions, and knowledge base management
2. **Agent Server**: Processes voice interactions using LiveKit for real-time communication
3. **Supervisor Client**: A React dashboard for supervisors to view and respond to escalated questions
4. **Voice Assistant Frontend**: Uses the LiveKit voice assistant frontend example repository for handling voice interactions

### Technologies Used

- **Backend**:
  - Node.js with Express.js
  - MongoDB with vector search capabilities
  - OpenAI API for embeddings and LLM
- **Agent Server**:
  - LiveKit SDK for voice agent capabilities
  - OpenAI for text generation and processing
- **Dashboard Frontend**:
  - React with TypeScript
  - TailwindCSS for styling
  - TanStack Query for data fetching
- **Voice Assistant Frontend**:
  - Using LiveKit's example repository: https://github.com/livekit-examples/voice-assistant-frontend

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account with vector search enabled
- OpenAI API key
- LiveKit account and API credentials
- Deepgram API key (used by LiveKit for speech-to-text)

### Installation

1. Clone the repository:

```
git clone https://github.com/anorangefalcon/WisdomLoop.git
cd WisdomLoop
```

2. Install dependencies:

```
pnpm install
cd supervisor-client
pnpm install
cd ..
```

3. Create a `.env` file based on `.env.example`:

```
PORT=7777
SERVER_URL=http://localhost:7777

LIVEKIT_URL=your-livekit-url
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret

DEEPGRAM_API_KEY=your-deepgram-key
OPENAI_API_KEY=your-openai-api-key

MONGODB_URI=your-mongodb-connection-string
```

4. Set up the LiveKit voice assistant frontend:

```
git clone https://github.com/livekit-examples/voice-assistant-frontend.git
cd voice-assistant-frontend
# Follow setup instructions in the frontend repository
```

### Running the Application

1. Start the backend server:

```
pnpm run dev
```

2. Start the AI agent:

```
pnpm run dev-agent
```

3. Start the supervisor client:

```
cd supervisor-client
pnpm run dev
```

## Development Approach

This project was developed using a clean, PR-based approach to make the implementation process transparent and easy to understand. Each major feature was built in separate pull requests, allowing reviewers to clearly see:

1. The thought process behind design decisions
2. Progressive implementation of components
3. How each feature integrates with the overall system
4. Incremental improvements and fixes

This structured approach also makes it easier to understand the development journey from initial setup to complete implementation of the human-in-the-loop system.

## System Flow

1. **Customer Interaction**: A customer calls and speaks with the AI receptionist (JARVIS)
2. **Knowledge Lookup**: The AI searches its knowledge base for relevant information
3. **Escalation**: If no answer is found, the AI tells the customer it will check with a supervisor
4. **Supervisor Dashboard**: The question appears in the Supervisor Dashboard under "Unanswered" tab
5. **Human Response**: A supervisor provides an answer through the dashboard
6. **Knowledge Update**: The answer is stored in the knowledge base with vector embeddings
7. **Agent Learning**: The AI can now answer similar questions in the future

## System Components

### AI Agent

The agent uses LiveKit for voice interaction and is powered by OpenAI's models. It has three main tools:

- `bookAppointment`: For scheduling appointments
- `searchKnowledge`: To search the knowledge base for answers
- `requestHumanHelp`: To escalate questions to supervisors

### Knowledge Base

The knowledge base uses MongoDB with vector search to enable semantic matching:

- Questions are stored with their corresponding answers and tags
- Embeddings are generated for efficient semantic search
- Status tracking (answered/unanswered) for query lifecycle management

### Supervisor Interface

A React-based dashboard with:

- Tab-based navigation between answered and unanswered questions
- Real-time updates using polling
- Simple interface for providing answers to escalated questions

## Design Decisions

### Knowledge Base Structure

- Used MongoDB with vector search for semantic matching
- Created composite embeddings combining questions, answers, and tags
- Implemented tagging for additional filtering and categorization

### Human Request Flow

- Simple lifecycle: Unanswered → Answered
- Polling mechanism for real-time updates (5-second intervals)
- Timeout handling (30 seconds) for supervisor availability

### Scalability Considerations

- MongoDB Atlas for database scaling
- Indexed queries for efficient retrieval
- Vector search for semantic matching scales to larger knowledge bases

## Future Improvements

- Implement WebSocket for real-time updates instead of polling
- Add authentication for supervisors
- Support for live call transfers to human supervisors
