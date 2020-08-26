

export class LocalStorageService {
  static getForKey(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  static setForKey(key: string, value: any) {
    const stringVal = JSON.stringify(value);
    localStorage.setItem(key, stringVal);
  }
}
