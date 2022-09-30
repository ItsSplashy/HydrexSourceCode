import { Action } from "..";

export interface AuthReducer {
  submit_button: boolean;
  alert: string | null;
  method: number;
  wrap_alert: {
    username: string | null;
    email: string | null;
    password: string | null;
  };
}

export const authReducer = (
  state: AuthReducer = {
    submit_button: false,
    alert: null,
    method: 0x0,
    wrap_alert: {
      username: null,
      email: null,
      password: null,
    },
  },
  action: Action<AuthReducer>,
): AuthReducer => {
  switch (action.type) {
    case "UPDATE_AUTH_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
