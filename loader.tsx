import React, { FC } from "react";

import circlesGlass from "../assets/img/circles_glass.svg";

export const LoaderScreen: FC = () => {
  return (
    <div id="loader-screen">
      <img src={circlesGlass} alt="" />
      <div className="fill">
        <div></div>
      </div>
      <div className="content-center">
        <div className="content-text">
          <div className="logo">HYDREX</div>
          <div className="description">
            The easiest way to get money in a short time
          </div>
        </div>
      </div>
    </div>
  );
};
