import { AuthUserState, initialAuthUserState } from './auth-user.state';

export interface AppState {
  authUser: AuthUserState;
}

export const initialAppState: AppState = {
  authUser: initialAuthUserState
};

// export function
