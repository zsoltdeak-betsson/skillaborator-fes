import {
  SelectedAndRightAnswer,
  Question,
} from '../../component/elaborator-question.model';
import { ElaboratorAction } from '../elaborator/elaborator.action';
import { on } from '@ngrx/store';
import { createRehydrateReducer } from 'src/app/service';

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

export const reviewReducer = createRehydrateReducer(
  initialState,
  on(
    ElaboratorAction.evaluateAnswersSuccess,
    (state: ReviewState, { evaluationResult, questions }) => {
      return {
        ...state,
        selectedAndRightAnswers: evaluationResult.selectedAndRightAnswers,
        score: evaluationResult.score,
        questions,
      };
    }
  ),
  // TODO: show some message, stop spinner
  on(ElaboratorAction.evaluateAnswersFail, (state: ReviewState) => ({
    ...state,
  }))
);
