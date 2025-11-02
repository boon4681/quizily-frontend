export interface QuizCardCategory {
    background?: string;
    name: string;
    emoji: string;
}

export interface QuizCardProps {
    id: string
    title: string
    state: string
    categories?: QuizCardCategory[]
    ondelete?: (id: string) => void
}