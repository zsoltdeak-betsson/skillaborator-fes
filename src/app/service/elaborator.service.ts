import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import {
  Question,
  SelectedAnswer,
  EvaluationResult,
} from '../component/elaborator-question.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElaboratorService {
  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getQuestion(answerIds: string[]): Observable<Question> {
    const questionEndpoint = this.config.getQuestionEndpoint();

    let requestParams = new HttpParams();

    answerIds.forEach(
      (answerId) => (requestParams = requestParams.append('answerId', answerId))
    );

    return this.httpClient.get<Question>(questionEndpoint, {
      params: requestParams,
      withCredentials: true,
    });
  }

  getSelectedAnswers(answerIds: string[]): Observable<EvaluationResult> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();
    let requestParams = new HttpParams();

    answerIds.forEach(
      (answerId) => (requestParams = requestParams.append('answerId', answerId))
    );

    return this.httpClient.get<EvaluationResult>(selectedAnswersEndpoint, {
      params: requestParams,
      withCredentials: true,
    });
  }
}
