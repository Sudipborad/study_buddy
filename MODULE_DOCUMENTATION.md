# Study Buddy - Module Documentation

This document provides a comprehensive overview of all modules, libraries, and technologies used in the Study Buddy application, organized by functionality.

## 📁 **File Processing & Document Parsing**

### PDF Processing

- **`pdf-parse`** (v1.1.1) - Server-side PDF text extraction
  - Usage: `frontend/src/app/api/upload/route.ts`
  - Purpose: Extracts text content from PDF files
  - Alternative: Previously used `pdfjs-dist` for client-side processing (removed)

### Word Document Processing

- **`mammoth`** (v1.7.2) - DOCX and DOC file text extraction
  - Usage: `frontend/src/app/api/upload/route.ts`
  - Purpose: Converts Word documents to plain text
  - Supports: .docx and .doc formats

### Text File Processing

- **Built-in Node.js Buffer** - Plain text file handling
  - Usage: `frontend/src/app/api/upload/route.ts`
  - Purpose: Reads .txt files directly as UTF-8 text

---

## 🤖 **AI & Machine Learning**

### AI Framework

- **`genkit`** (v1.14.1) - Google's AI application framework
  - Usage: `frontend/src/ai/genkit.ts`
  - Purpose: Main AI orchestration and flow management

### AI Providers

- **`@genkit-ai/googleai`** (v1.14.1) - Google Gemini AI integration

  - Usage: `frontend/src/ai/genkit.ts`
  - Purpose: Connects to Google Gemini 2.0 Flash model
  - Features: Text generation, summarization, question answering
  - Used for: Document summarization, flashcards, quiz, video recommendations

- **OpenAI/GPT API** (Direct API calls) - OpenRouter integration
  - Usage: `frontend/src/ai/chat-genkit.ts`
  - Purpose: Powers the document chatbot functionality
  - Model: `openai/gpt-oss-20b:free`
  - API Base: `https://openrouter.ai/api/v1`
  - Used for: Document chat only

### AI Flows

- **Document Summarization**: `frontend/src/ai/flows/summarize-document.ts` (Genkit + Gemini)
- **Flashcard Generation**: `frontend/src/ai/flows/generate-flashcards.ts` (Genkit + Gemini)
- **Quiz Generation**: `frontend/src/ai/flows/generate-quiz.ts` (Genkit + Gemini)
- **Document Chat**: `frontend/src/ai/flows/chat-with-document.ts` (Direct OpenAI API)
- **Video Recommendations**: `frontend/src/ai/flows/recommend-videos.ts` (Genkit + Gemini)

---

## 🎥 **Video Search & Recommendations**

### YouTube Integration

- **YouTube Data API v3** - Video search and metadata
  - Usage: `frontend/src/services/youtube.ts`
  - Purpose: Searches for educational videos related to study material
  - Requires: `NEXT_PUBLIC_YOUTUBE_API_KEY` environment variable
  - Fallback: Educational search alternatives when API unavailable

---

## 🗄️ **Database & Backend**

### Runtime Environment

- **Node.js** (v18+) - JavaScript runtime environment
  - Usage: Entire backend execution environment
  - Purpose: Runs JavaScript on the server
  - Features: Event-driven, non-blocking I/O, built-in modules (fs, http, path, etc.)

### Database

- **`mongoose`** (v8.0.0) - MongoDB object modeling
  - Usage: `backend/src/config/database.ts`, `backend/src/models/`
  - Purpose: Database connection and schema management
  - Connection: MongoDB Atlas cloud database

### Web Server Framework

- **`express`** (v4.18.2) - Web application framework built on top of Node.js
  - Usage: `backend/src/index.ts`
  - Purpose: REST API server, routing, middleware handling
  - Relationship: Express.js runs **inside** Node.js runtime
  - Benefits: Simplifies HTTP server creation, routing, and middleware management

### Security & Middleware

- **`helmet`** (v7.0.0) - Security headers
- **`cors`** (v2.8.5) - Cross-origin resource sharing
- **`compression`** (v1.7.4) - Response compression
- **`morgan`** (v1.10.0) - HTTP request logging

---

## 🔐 **Authentication & Security**

### Password Security

- **`bcryptjs`** (v2.4.3) - Password hashing
  - Usage: `backend/src/models/User.ts`
  - Purpose: Secure password hashing and verification

### Token Management

- **`jsonwebtoken`** (v9.0.2) - JWT token creation/verification
  - Usage: `backend/src/middleware/auth.ts`, `backend/src/controllers/auth.ts`
  - Purpose: User authentication and session management

### Input Validation

- **`express-validator`** (v7.0.1) - Server-side input validation
  - Usage: `backend/src/routes/` validation middleware
  - Purpose: Validates and sanitizes user input

---

## 🎨 **Frontend UI & Styling**

### Frontend Framework

- **`next`** (v15.3.3) - React framework
  - Usage: Entire frontend application structure
  - Features: App Router, API routes, server components

### UI Component Library

- **Radix UI Components** - Headless, accessible components
  - `@radix-ui/react-*` (various versions)
  - Components: Dialog, Dropdown, Tabs, Toast, Select, etc.
  - Usage: `frontend/src/components/ui/`

### Styling

- **`tailwindcss`** (v3.4.1) - Utility-first CSS framework
- **`tailwindcss-animate`** (v1.0.7) - Animation utilities
- **`tailwind-merge`** (v3.0.1) - Conditional class merging

### Icons

- **`lucide-react`** (v0.475.0) - Icon library
  - Usage: Throughout UI components
  - Purpose: Consistent iconography

---

## 📊 **Data Visualization & Charts**

### Charting Library

- **`recharts`** (v2.15.1) - React charting library
  - Usage: Quiz results, study progress visualization
  - Purpose: Interactive charts and graphs

---

## 📝 **Form Handling & Validation**

### Form Management

- **`react-hook-form`** (v7.54.2) - Form state management
  - Usage: Authentication forms, settings forms
  - Purpose: Efficient form handling with validation

### Schema Validation

- **`zod`** (v3.24.2) - TypeScript-first schema validation
  - Usage: Form validation, API data validation
  - Purpose: Type-safe data validation

### Form Validation Integration

- **`@hookform/resolvers`** (v4.1.3) - React Hook Form + Zod integration

---

## 📅 **Date & Time Handling**

### Date Utilities

- **`date-fns`** (v3.6.0) - Date manipulation library
  - Usage: Date formatting, calculations
  - Purpose: Study session timestamps, material creation dates

### Date Picker

- **`react-day-picker`** (v8.10.1) - Date picker component
  - Usage: Scheduling, date selection in forms

---

## 🎠 **UI Enhancement Libraries**

### Carousel Component

- **`embla-carousel-react`** (v8.6.0) - Carousel/slider component
  - Usage: Image galleries, content sliders
  - Purpose: Interactive content navigation

### Utility Libraries

- **`clsx`** (v2.1.1) - Conditional className utility
- **`class-variance-authority`** (v0.7.1) - Component variant management

---

## 🛠️ **Development & Build Tools**

### TypeScript

- **`typescript`** (v5.0.0) - Static type checking
  - Usage: Entire application
  - Purpose: Type safety and better developer experience

### Development Server

- **`ts-node-dev`** (v2.0.0) - TypeScript development server
  - Usage: Backend development (`npm run dev`)
  - Purpose: Hot reloading during development

### Environment Management

- **`dotenv`** (v16.3.1) - Environment variable loading
  - Usage: `backend/src/index.ts`, AI configuration
  - Purpose: Secure configuration management

---

## 📦 **File Upload & Processing**

### File Upload Middleware

- **`multer`** (v1.4.5-lts.1) - Multipart form data handling
  - Usage: Backend file upload endpoints
  - Purpose: Handles file uploads in Express.js

### File Size Limits

- **Express.js built-in limits** - 5MB limit for JSON/URL-encoded data
- **Custom validation** - 5MB limit enforced in frontend

---

## 🧪 **Testing Framework**

### Testing Library

- **`jest`** (v29.7.0) - JavaScript testing framework
  - Usage: Backend unit tests
  - Purpose: Test coverage and reliability

---

## 🌐 **API Integration**

### HTTP Client

- **Fetch API** (built-in) - HTTP requests
  - Usage: `frontend/src/lib/api.ts`
  - Purpose: Frontend-backend communication

### External APIs

- **YouTube Data API v3** - Video search
- **Google Gemini API** - AI processing
- **MongoDB Atlas** - Cloud database

---

## 📱 **Mobile Responsiveness**

### Responsive Design Hook

- **Custom Hook**: `frontend/src/hooks/use-mobile.tsx`
  - Purpose: Detects mobile screen sizes
  - Implementation: Uses `window.matchMedia` API

---

## 🔄 **State Management**

### Context API

- **React Context** - Global state management
  - `AuthContext`: User authentication state
  - `StudyMaterialContext`: Document and AI-generated content state
  - Usage: `frontend/src/contexts/`

---

## 🎯 **Key Environment Variables**

```bash
# Backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-url.com

# Frontend - AI Services
GEMINI_API_KEY=your-gemini-api-key                    # For summarization, flashcards, quiz, videos
OPENAI_API_KEY=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  # For chatbot only

# Frontend - Other Services
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 📁 **Project Structure Summary**

```
study_buddy/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, error handling
│   │   └── controllers/    # Business logic
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── ai/            # Genkit AI flows
│   │   ├── lib/           # Utilities and configurations
│   │   ├── contexts/      # React Context providers
│   │   └── services/      # External API integrations
└── docs/                  # Documentation
```

This documentation covers all major modules and their specific purposes in your Study Buddy application. Each module has been chosen for its specific functionality and integrates with the overall architecture to create a comprehensive study assistance platform.
