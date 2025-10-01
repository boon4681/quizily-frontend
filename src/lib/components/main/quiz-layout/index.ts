import type { QuestionType } from "$lib/utils/index";


export interface QuestionChoice {
    id: string,
    text: string
}

export interface Question {
    id: string;
    type: QuestionType;
    title: string;
    choices: QuestionChoice[];
    correct: string;
}

export { default as QuizLayout } from "./quiz-layout.svelte"