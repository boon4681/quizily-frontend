export interface QuizCardCategory {
    background?: string;
    name: string;
    emoji: string;
}

export interface QuizCardProps {
    id: string
    title: string
    categories?: QuizCardCategory[]
}