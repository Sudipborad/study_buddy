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
