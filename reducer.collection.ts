import { combineReducers } from "redux";
import { appReducer } from "./reducers/app.reducer";
import { settingsReducer } from "./reducers/settings.reducer";
import { authReducer } from "./reducers/auth.reducer";
import { recoverReducer } from "./reducers/recover.reducer";

export const ReducersCollection = combineReducers({
  appReducer,
  settingsReducer,
  authReducer,
  recoverReducer,
});
