

export interface QuestionChoice {
    id: string,
    text: string
}

export interface Question {
    id: string;
    title: string;
    choices: QuestionChoice[];
    correct: string;
}

export { default as QuizLayout } from "./quiz-layout.svelte"