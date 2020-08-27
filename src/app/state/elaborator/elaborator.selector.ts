import { AppState } from '../..';

export const getCurrentQuestion = (state: AppState) =>
  state.elaborator.currentQuestion;

export const getQuestions = (state: AppState) => state.elaborator.questions;

export const getLoadingCurrentQuestion = (state: AppState) => state.elaborator.busy;
