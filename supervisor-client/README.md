# WisdomLoop Supervisor Client

The Supervisor Client is a web dashboard for human supervisors to review and answer questions that AI agents have escalated in almost real time.

## Overview

This dashboard allows supervisors to:

- View questions submitted by AI agents that need human expertise
- Provide answers to pending questions
- Review previously answered questions

## Features

- **Tab-based navigation**: Switch between unanswered and answered questions
- **Real-time polling**: Automatically checks for new questions every 5 seconds
- **Simple editing interface**: Easily add answers to pending questions
- **Tag support**: Questions include contextual tags for better categorization

## Technology Stack

- **Framework**: React with TypeScript
- **Build tool**: Vite
- **Styling**: TailwindCSS with custom CSS variables
- **State Management**: TanStack Query for API requests

## Getting Started

1. Install dependencies:

   ```
   pnpm install
   ```

2. Start the development server:
   ```
   pnpm dev
   ```

## Project Structure

- `/src/components` - Main React components
- `/src/elements` - Reusable UI elements (Popup, Table)
- `/src/interfaces` - TypeScript interfaces
- `/src/query-hooks` - API communication hooks

## Integration

The Supervisor Client communicates with the WisdomLoop server API to:

1. Fetch pending and answered questions
2. Submit answers to questions
3. Keep the knowledge base synchronized
