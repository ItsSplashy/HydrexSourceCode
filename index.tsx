import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppEntry } from "./main/entry";
import { store } from "./redux";

import "./assets/styles/main.scss";

export const ENDPOINT: string = "http://localhost:7070";
export const CLIENTURI: string = "http://localhost:8080";
// export const CLIENTURI: string = "http://20.40.249.38";
// export const ENDPOINT: string = "http://20.40.249.38:7070";

export const SITE_KEY: string = "6LeNc7ogAAAAACkzKsS8CXr-32JI7LdgFdlSgZlq";

ReactDOM.render(
  <Provider store={store}>
    <AppEntry />
  </Provider>,
  document.getElementById("app")
);
