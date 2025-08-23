
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  explanation: string;
}

export interface UserAnswer {
  question: string;
  answer: string;
  isCorrect: boolean;
}

export interface QuizAnalysis {
  strongAreas: string[];
  weakAreas: string[];
  overallFeedback: string;
}

export enum AppState {
  CONFIG,
  GENERATING,
  TAKING_QUIZ,
  ANALYZING,
  RESULTS,
}

export enum QuizMode {
  STANDARD = "Standard",
  FUN = "Fun & Quirky",
  EXPERT = "Expert Level",
  KIDS = "For Kids"
}

export enum ApiProvider {
  GOOGLE = "Google AI (Gemini)",
  OPENROUTER = "OpenRouter (Free Models)",
}