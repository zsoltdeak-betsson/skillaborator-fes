import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import {
  Question,
  SelectedAnswer,
  EvaluationResult,
} from '../component/elaborator-question.model';
import { Observable } from 'rxjs';
import {
  LocalStorageService,
  PREVIOUS_QUESTION_IDS_STORAGE_KEY,
} from './utils/localstorage.service';

@Injectable({ providedIn: 'root' })
export class ElaboratorService {
  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getQuestion(answerIds: string[]): Observable<Question> {
    const questionEndpoint = this.config.getQuestionEndpoint();
    const previousQuestionIds =
      LocalStorageService.getForKey(PREVIOUS_QUESTION_IDS_STORAGE_KEY) ?? [];

    let requestParams = new HttpParams();

    answerIds.forEach(
      (answerId) => (requestParams = requestParams.append('answerId', answerId))
    );

    previousQuestionIds.forEach(
      (previousQuestionId) =>
        (requestParams = requestParams.append(
          'previousQuestionId',
          previousQuestionId
        ))
    );

    return this.httpClient.get<Question>(questionEndpoint, {
      params: requestParams,
      withCredentials: true,
    });
  }

  postSelectedAnswers(
    selectedAnswers: SelectedAnswer[]
  ): Observable<EvaluationResult> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();
    return this.httpClient.post<EvaluationResult>(
      selectedAnswersEndpoint,
      {
        selectedAnswers,
      },
      {
        withCredentials: true,
      }
    );
  }
}
