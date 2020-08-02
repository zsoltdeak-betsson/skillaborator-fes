export interface Question {
    id: string;
    question: string;
    answers: Answer[];
    level: number;
}

export interface Answer {
    id: string;
    value: string;
}

export interface SelectedAnswer {
    questionId: string;
    answerId: string;
}
