export namespace AuthUtils {
  export const storageKey = 'currentUser';

  export function saveAuthData(data: any): void {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  export function getAuthData(): any {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch (e) {
      return null;
    }
  }

  export function getAuthToken(): string {
    const authData = AuthUtils.getAuthData();
    return !!authData && authData.token;
  }
}
