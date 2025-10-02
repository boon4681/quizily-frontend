import type { QuestionType } from "./index";


export function getTypeName(type: QuestionType) {
    switch (type) {
        case "binary": return "T/F"
        case "multiple": return "Multiple"
    }
}