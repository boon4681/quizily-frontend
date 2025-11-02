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

export interface Quiz {
    ownerId: string | null
    description: string | null;
    emoji: {
        category: string;
        emoji: string;
    }[];
    title: string;
    id: string;
    state: string;
    share: boolean;
    shareId: string | null;
};

export type RawQuestion = {
    questions: ({
        id: string;
        title: string;
        type: string;
    } & {
        options: {
            id: string;
            text: string;
            isCorrect: boolean;
        }[];
    })[]
};

export type QuizWithQuestions = Quiz & RawQuestion;

export { default as QuizLayout } from "./quiz-layout.svelte"