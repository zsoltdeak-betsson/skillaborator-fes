export const QUESTION_IDS_STORAGE_KEY = "questionIds";
export const ANSWER_IDS_STORAGE_KEY = "answerIds";


export class LocalStorageService {
  static getForKey(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  static setForKey(key: string, value: any) {
    const stringVal = JSON.stringify(value);
    localStorage.setItem(key, stringVal);
  }
}
