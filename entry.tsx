import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import { CLIENTURI } from "..";
import { Authentication } from "../pages/authentication.page";
import { Dashboard } from "../pages/dashboardentry.page";
import { ErrorPage } from "../pages/error.page";
import { HomePage } from "../pages/home.page";
import { RecoverPage } from "../pages/recover.page";
import { StateInterface } from "../redux";
import { AppReducer } from "../redux/reducers/app.reducer";
import { getValueOfQuery } from "../utils/parseQueries";

export const AppEntry: FC = () => {
  // const navigate = useNavigate();
  const { appReducer } = ((window as any).state = useSelector<
    StateInterface,
    StateInterface
  >((state) => state));

  useEffect(() => {
    let referral_id = getValueOfQuery("f", document.URL);
    if (referral_id) {
      location.href = CLIENTURI + "#/auth?f=" + referral_id;
    }
  }, []);

  return (
    <div>
      {appReducer.error_page_content ? (
        <ErrorPage />
      ) : (
        <div id="entry-content">
          <HashRouter>
            <div id="container-pages">
              <Routes>
                <Route path="/auth" element={<Authentication />} />
                <Route path="/recover" element={<RecoverPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
          </HashRouter>
        </div>
      )}
    </div>
  );
};
