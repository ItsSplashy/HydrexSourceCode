import React, { FC } from "react";

import settingsImage from "../assets/img/settings.svg";
import logoImage from "../assets/img/logo.svg";
import { Link, useLocation } from "react-router-dom";

interface ButtonSideBar {
  title: string;
  path: string;
  image: string;
}

export const SideBarEntry: FC = () => {
  const location = useLocation();

  const buttons: ButtonSideBar[] = [
    {
      title: "Settings",
      path: "/auth",
      image: settingsImage,
    },
    {
      title: "Settingss",
      path: "/settingss",
      image: settingsImage,
    },
    {
      title: "Settingsss",
      path: "/settingsss",
      image: settingsImage,
    },
  ];

  return (
    <div id="sidebar-entry">
      <div className="bar-inside">
        <div className="top-side">
          <div id="profile-section" className="button">
            <img src={logoImage} alt="User avatar" />
          </div>
        </div>
        <div className="down-side">
          {buttons.map((pathObject, i) => (
            <Link to={pathObject.path} key={i}>
              <div
                className={"button" + (pathObject.path === location.pathname ? " active" : "")}
                title={pathObject.title}
              >
                <div className="line-focus"></div>
                <img src={pathObject.image} alt={pathObject.title} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
