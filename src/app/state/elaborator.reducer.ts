import { Question, SelectedAnswer } from "../component/elaborator-lobby.model";
import { createReducer, on, Action } from "@ngrx/store";
import { ElaboratorAction } from "./elaborator.action";

export interface ElaboratorState {
    questions: Question[];
    selectedAnswers: SelectedAnswer[];
}

const initialState = {
    questions: [],
    selectedAnswers: []
};

export const elaboratorReducer = createReducer(
    initialState,
    on(ElaboratorAction.getQuestionSuccess, (state, { question }) => ({ ...state, questions: [...state.questions, question] })),
);
