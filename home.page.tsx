import React, { FC } from "react";
import { SideBarHome } from "../components/home/sidebar.home";

import waveImage from "../assets/img/circles_glass.png";

export const HomePage: FC = () => {
  return (
    <div id="home-page" className="container">
      <img src={waveImage} alt="" />
      <SideBarHome />
    </div>
  );
};
