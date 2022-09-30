import { Action } from "..";

export interface SettingsReducer {}

export const settingsReducer = (
  state: SettingsReducer = {},
  action: Action<SettingsReducer>
): SettingsReducer => {
  switch (action.type) {
    case "UPDATE_SETTINGS_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
