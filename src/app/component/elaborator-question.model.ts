export interface Question {
  id: string;
  value: string;
  answers: Answer[];
  level: number;
  code?: string;
}

export interface Answer {
  id: string;
  value: string;
}

export interface SelectedAnswer {
  questionId: string;
  answerId: string;
}
