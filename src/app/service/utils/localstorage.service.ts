export const SELECTED_ANSWERS_STORAGE_KEY = 'selectedAnswers';
export const PREVIOUS_QUESTION_IDS_STORAGE_KEY = 'previousQuestionIds';

export class LocalStorageService {
  static getForKey(key: string): any | null {
    const item = localStorage.getItem(key);
    return item && JSON.parse(item);
  }

  static setForKey(key: string, value: any) {
    const stringVal = JSON.stringify(value);
    localStorage.setItem(key, stringVal);
  }

  static remove(key: string) {
    localStorage.removeItem(key);
  }

  static push(key: string, value: any) {
    const oldItems = LocalStorageService.getForKey(key) ?? [];
    oldItems.push(value);
    LocalStorageService.setForKey(key, oldItems);
  }
}
