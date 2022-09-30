import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import backImage from "../../assets/img/back.svg";
import { Dispatch, StateInterface } from "../../redux";
import { AppReducer } from "../../redux/reducers/app.reducer";
import { ChangePasswordSettings } from "./container/settings/change_password.settings";
import { EditeProfileSettings } from "./container/settings/edite_profile.settings";

export const AccountSettings: FC = () => {
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { configs, settings_content } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  const sidebar_buttons = [
    { type: "label", content: "ACCOUNT OVERVIEW" },
    { type: "button", content: "Edite Profile" },
    { type: "label", content: "Privacy settings" },
    { type: "button", content: "Change Password" },
  ];

  const updateSettingsProps = (
    data: Partial<AppReducer["settings_content"]>,
  ) => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        settings_content: Object.assign(settings_content, data),
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        dropDown: false,
      },
    });

    let pressed = false;

    window.onkeydown = (event) => {
      if (event.keyCode === 27 && !pressed) {
        pressed = true;
        updateSettingsProps({
          enabled: false,
        });
      }
    };

    window.onkeyup = (event) => {
      let pressed = false;
      if (event.keyCode === 27 && pressed) {
        pressed = false;
      }
    };
  }, []);

  return (
    <div id="account-settings">
      <div
        className="back-button"
        onClick={() =>
          updateSettingsProps({
            enabled: false,
          })
        }
      >
        <img src={backImage} /> <span>Back [ESC]</span>
      </div>
      <div className="settings-sidebar">
        {sidebar_buttons.map((object, i) => (
          <div
            className={object.type}
            key={i}
            onClick={() =>
              object.type === "button"
                ? updateSettingsProps({
                    content_type: i,
                  })
                : null
            }
          >
            {object.content}
          </div>
        ))}
        <div className="footer-info">
          <div className="line"></div>
          <span>{configs?.version_text ?? "Beta Version"}</span>
        </div>
      </div>
      <div className="main-content">
        {settings_content.content_type === 0x1 ? (
          <EditeProfileSettings />
        ) : null}
        {settings_content.content_type === 0x3 ? (
          <ChangePasswordSettings />
        ) : null}
      </div>
    </div>
  );
};
