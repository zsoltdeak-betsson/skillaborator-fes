import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import {
  Question,
  SelectedAnswer,
  SelectedAndRightAnswer,
} from '../component/elaborator-question.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElaboratorService {
  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getQuestion(selectedQuestionIds: string[]): Observable<Question> {
    const questionEndpoint = this.config.getQuestionEndpoint();
    const requestParams = new HttpParams();
    selectedQuestionIds.forEach((selectedQuestionId) =>
      requestParams.append('answerId', selectedQuestionId)
    );

    return this.httpClient.get<Question>(questionEndpoint, {
      params: requestParams,
    });
  }

  postSelectedAnswers(
    selectedAnswers: SelectedAnswer[]
  ): Observable<SelectedAndRightAnswer[]> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();
    return this.httpClient.post<SelectedAndRightAnswer[]>(
      selectedAnswersEndpoint,
      { selectedAnswers }
    );
  }
}
