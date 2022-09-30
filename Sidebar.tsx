import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "../../redux";
import { AppReducer } from "../../redux/reducers/app.reducer";
import { intToString } from "../../utils/format_number";
import { useNavigate } from "react-router-dom";

// imgs
import logoAnimate from "../../assets/img/logo_animate.svg";
import unknwon_image from "../../assets/img/unknwon_image.png";
import slideDownImage from "../../assets/img/slide_down.svg";
import EarnImage from "../../assets/img/dash/earn.svgn";
import StatusEarnImage from "../../assets/img/dash/discord.svgn";
import referralImage from "../../assets/img/dash/referral.svgn";
import coinImage from "../../assets/img/coin.svg";
import settingsImage from "../../assets/img/settings.svg";
import logoutImage from "../../assets/img/logout.svg";
import cashoutImage from "../../assets/img/dash/cashout.svgn";

interface ButtonsSideBar {
  title: string;
  Image: React.SFC<React.SVGProps<SVGSVGElement>>;
}

export const SideBarDashboard: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { user, dropDown, container_dash, checkout_content, settings_content } =
    useSelector<StateInterface, AppReducer>((state) => state.appReducer);

  const buttonsOfContainers: ButtonsSideBar[] = [
    {
      title: "Earn Points",
      Image: EarnImage,
    },
    {
      title: "Status Earn",
      Image: StatusEarnImage,
    },
    {
      title: "Invite friends",
      Image: referralImage,
    },
    {
      title: "Cashout",
      Image: cashoutImage,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const setContainerDash = (id: number) => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        container_dash: id,
        checkout_content: Object.assign(checkout_content, {
          type_content: 0x0,
        }),
      },
    });
  };

  return (
    <div id="sidebar-dashboard">
      <div className="logo">
        <img src={logoAnimate} alt="Hydrex" />
      </div>
      <div className="line-between"></div>
      <div className="wrap-overall user-details-section">
        <div className="lined"></div>
        <div className="lined-right"></div>
        <div className="content-inside">
          <div className="square-avatar">
            <div
              className="circle"
              style={{
                backgroundImage: `url(${
                  !user?.avatar || user?.avatar === "default"
                    ? unknwon_image
                    : user?.avatar
                })`,
              }}
            ></div>
          </div>
          <div className="details-text">
            <div className="name">
              {user?.username
                ? user?.username.length >= 13
                  ? user?.username.slice(0, 13) + ".."
                  : user?.username
                : null}
            </div>
            <div className="role">
              {user?.admin ? "Hydrex Moderator" : "Hydrex User"}
            </div>
          </div>
        </div>
        <div
          className="slide-down"
          onClick={() =>
            dispatch({
              type: "UPDATE_APP_STATE",
              payload: {
                dropDown: true,
              },
            })
          }
        >
          <div className="center">
            <img src={slideDownImage} />
          </div>
          {dropDown ? (
            <div className="select-options">
              <div
                id="settings"
                className="option"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_APP_STATE",
                    payload: {
                      dropDown: false,
                      settings_content: Object.assign(settings_content, {
                        enabled: true,
                      }),
                    },
                  })
                }
              >
                <img src={settingsImage} alt="Settings" />{" "}
                <span>Account Setting</span>
              </div>
              <div id="logout" className="option" onClick={() => logout()}>
                <img src={logoutImage} alt="Logout" /> <span>Logout</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="wrap-overall balance-details-section">
        <div className="lined"></div>
        <div className="lined-right"></div>
        <div className="content-inside">
          <div className="text">BALANCE</div>
          <div className="balance">
            {intToString(parseFloat(user?.balance ?? "0"))}{" "}
            <img src={coinImage} />
          </div>
        </div>
      </div>
      <div className="pages-section">
        <div className="title">Pages</div>
        <div className="buttons">
          {buttonsOfContainers.map(({ Image, title }, i) => (
            <div
              id={title}
              className={"button" + (i === container_dash ? " active" : "")}
              onClick={() => setContainerDash(i)}
              key={i}
            >
              <div className="lined"></div>
              <div className="gradient-section">
                <Image fill={i === container_dash ? "#6139e6" : "#bbbbbb"} />
                <span>{title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
