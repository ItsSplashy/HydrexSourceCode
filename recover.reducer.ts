import { Action } from "..";

export interface RecoverReducer {
  submit_button: boolean;
  alert: string | null;
  method: number;
  wrap_alert: {
    email: string | null;
    code: string | null;
    password: string | null;
  };
}

export const recoverReducer = (
  state: RecoverReducer = {
    submit_button: false,
    alert: null,
    method: 0x0,
    wrap_alert: {
      email: null,
      password: null,
      code: null,
    },
  },
  action: Action<RecoverReducer>,
): RecoverReducer => {
  switch (action.type) {
    case "UPDATE_RECOVER_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
