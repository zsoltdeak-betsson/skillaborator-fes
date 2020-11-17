import {
  SelectedAndRightAnswer,
  Question,
} from '../../component/elaborator-question.model';
import { ElaboratorAction } from '../elaborator/elaborator.action';
import { createReducer, on } from '@ngrx/store';

export interface ReviewState {
  selectedAndRightAnswers: SelectedAndRightAnswer[];
  score: number;
  questions: Question[];
}

const initialState = {
  selectedAndRightAnswers: [],
  score: 0,
  questions: [],
};

export const reviewReducer = createReducer(
  initialState,
  on(ElaboratorAction.getQuestionSuccess, (state, { question }) => ({
    ...state,
    questions: [...state.questions, question],
  })),
  on(ElaboratorAction.evaluateAnswers, (state: ReviewState) => ({
    ...state,
  })),
  on(
    ElaboratorAction.evaluateAnswersSuccess,
    (state: ReviewState, { evaluationResult }) => {
      return {
        ...state,
        selectedAndRightAnswers: evaluationResult.selectedAndRightAnswers,
        score: evaluationResult.score,
      };
    }
  ),
  // TODO: show some message, stop spinner
  on(ElaboratorAction.evaluateAnswersFail, (state: ReviewState) => ({
    ...state,
  }))
);
