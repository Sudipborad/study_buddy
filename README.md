# Study Smarter - AI-Powered Learning Assistant

Study Smarter is a modern web application built with Next.js and powered by AI to help you supercharge your learning process. Transform your study materials into interactive flashcards, quizzes, get video recommendations, build a professional resume, and prepare for interviews—all in one place.

## ✨ Features

- **Document Upload**: Upload PDF or Word documents to get started.
- **AI Summarizer**: Get concise, AI-generated summaries of your uploaded materials.
- **Flashcard Generator**: Instantly create flashcards from your study notes.
- **Quiz Generator**: Test your knowledge with custom quizzes based on your documents.
- **Document Chatbot**: Ask questions and get answers from an AI assistant that understands the context of your uploaded file.
- **Video Recommender**: Receive relevant YouTube video suggestions to deepen your understanding of topics, powered by the YouTube Data API.
- **CV/Resume Maker**: Build a professional resume with a user-friendly form and live preview.
- **Interview Prep**: Generate a multiple-choice quiz based on the skills listed in your resume to prepare for technical interviews.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Project Structure

This project is organized into separate frontend and backend folders:

```
study-buddy/
├── frontend/          # Next.js frontend application
│   ├── src/          # Source code
│   ├── package.json  # Frontend dependencies
│   └── ...
├── backend/          # Firebase backend services
│   ├── firebase.json # Firebase configuration
│   ├── package.json  # Backend dependencies
│   └── ...
└── package.json      # Root package.json for managing both
```

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [Firebase CLI](https://firebase.google.com/docs/cli) for backend services

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/study-smarter.git
    cd study-smarter
    ```

2.  **Install all dependencies:**
    ```bash
    npm run install:all
    ```

### Environment Variables

To run this project, you need to set up your environment variables. Create a file named `.env.local` in the `frontend` folder and add the following variables.

```env
# Google AI API Key for Genkit
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# YouTube Data API Key for Video Recommender
# See: https://developers.google.com/youtube/v3/getting-started
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
```

You can obtain a `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Available Scripts

-   **Run both frontend and backend in development:**
    ```bash
    npm run dev
    ```
    This will start the Next.js frontend on [http://localhost:3000](http://localhost:3000) and Firebase emulators for the backend.

-   **Run only the frontend:**
    ```bash
    npm run dev:frontend
    ```

-   **Run only the backend:**
    ```bash
    npm run dev:backend
    ```

-   **Build both frontend and backend:**
    ```bash
    npm run build
    ```

-   **Frontend-specific commands:**
    ```bash
    cd frontend
    npm run dev     # Development server
    npm run build   # Production build
    npm run start   # Production server
    npm run lint    # Lint code
    ```

-   **Backend-specific commands:**
    ```bash
    cd backend
    npm run serve   # Start Firebase emulators
    npm run deploy  # Deploy to Firebase
    npm run logs    # View Firebase logs
    ```
