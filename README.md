# StudyBuddy - AI-Powered Learning Assistant

StudyBuddy is a modern web application built with Next.js and powered by AI to help you supercharge your learning process. Transform your study materials into interactive flashcards, quizzes, get video recommendations, build a professional resume, and prepare for interviews—all in one place.

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
- **Backend**: [Express.js](https://expressjs.com/) with [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT-based authentication
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

This project is organized into separate frontend and backend folders:

```
study-buddy/
├── frontend/          # Next.js frontend application
│   ├── src/          # Source code
│   ├── package.json  # Frontend dependencies
│   └── ...
├── backend/          # Express.js backend with MongoDB
│   ├── src/          # TypeScript source code
│   ├── .env          # Environment variables
│   ├── package.json  # Backend dependencies
│   └── ...
└── package.json      # Root package.json for managing both
```

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) OR [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud database)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/study-buddy.git
    cd study-buddy
    ```

2.  **Install all dependencies:**
    ```bash
    npm run install:all
    ```

### Environment Variables

To run this project, you need to set up environment variables for both frontend and backend.

**Backend (.env):**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/study_buddy
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/study_buddy

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI (Optional)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

**Frontend (.env.local):**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# YouTube Data API Key for Video Recommender
# See: https://developers.google.com/youtube/v3/getting-started
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
```

You can obtain a `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Manual Setup

**Start Backend:**

```bash
cd backend
npm install
npm run dev
```

**Start Frontend (in new terminal):**

```bash
cd frontend
npm install
npm run dev
```

- **Build both frontend and backend:**

  ```bash
  npm run build
  ```

- **Frontend-specific commands:**

  ```bash
  cd frontend
  npm run dev     # Development server
  npm run build   # Production build
  npm run start   # Production server
  npm run lint    # Lint code
  ```

- **Backend-specific commands:**
  ```bash
  cd backend
  npm run dev     # Development server with auto-reload
  npm run build   # Build TypeScript to JavaScript
  npm run start   # Production server
  ```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB: `mongod`
3. Use default connection: `mongodb://localhost:27017/study_buddy`

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and database user
3. Get connection string and update `MONGODB_URI` in backend/.env

For detailed migration information, see `MONGODB_MIGRATION.md`.
