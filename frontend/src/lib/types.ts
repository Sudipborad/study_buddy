export interface Flashcard {
  front: string;
  back: string;
}

export interface VideoRecommendation {
  title: string;
  thumbnail: string;
  link: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface DocumentSummary {
  summary: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface CvData {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    personalStatement: string;
    experience: {
        jobTitle: string;
        company: string;
        startDate: string;
        endDate: string;
        responsibilities: string;
    }[];
    education: {
        degree: string;
        institution: string;
        graduationDate: string;
    }[];
    skills: string[];
}
