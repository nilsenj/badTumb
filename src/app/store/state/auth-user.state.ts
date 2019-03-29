import { User } from '../../models/User';

export interface AuthUserState {
  user: User;
}

export const initialAuthUserState: AuthUserState = {
  user: null
};
