import React, { useEffect } from "react";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "../../../redux";
import { AppReducer } from "../../../redux/reducers/app.reducer";
import { toast } from "react-hot-toast";
import { intToString } from "../../../utils/format_number";
import { ENDPOINT } from "../../..";
import axios from "axios";
import { RequestResponse } from "../../../pages/authentication.page";

import rightImage from "../../../assets/img/right.svg";
import uknownImage from "../../../assets/img/unknwon_image.png";
import removeImage from "../../../assets/img/remove.svg";
import coinImage from "../../../assets/img/coin.svg";
import { BinaryWriter } from "../../../utils/binary_packet";

export const StatusEarnPage: FC = () => {
  const [buttonDelete, setButtonDelete] = useState(false);
  const [nextPayout, setnextPayout] = useState([0x0, 0x0, 0x0]);
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { user, next_payout_time_left, joined_discord_server } = useSelector<
    StateInterface,
    AppReducer
  >((state) => state.appReducer);

  let fetchUserIfJoined = () => {
    let bnf = new BinaryWriter();
    bnf.setUint8(0x2).setStringZeroUtf8(user?.discord?.id ?? "0");
    (window as any).wsocket.send(bnf.build());
  };

  useEffect(() => {
    let intervalTime: NodeJS.Timer | null = null;
    let fetchPayoutTime = () => {
      let bnf = new BinaryWriter();
      bnf.setUint8(0x1).setStringZeroUtf8(user?.discord?.id ?? "0");
      (window as any).wsocket.send(bnf.build());
    };

    fetchPayoutTime();
    fetchUserIfJoined();

    if (next_payout_time_left) {
      let formateTime = () => {
        var now = new Date().getTime();

        var distance = next_payout_time_left - now;

        var hours = Math.floor(
          (distance % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60),
        );
        var minutes = Math.floor((distance % (1e3 * 60 * 60)) / (1e3 * 60));
        var seconds = Math.floor((distance % (1e3 * 60)) / 1e3);

        setnextPayout([hours, minutes, seconds]);

        if (intervalTime && distance <= 0x0) {
          setnextPayout([0x0, 0x0, 0x0]);
          fetchPayoutTime();
        }
      };

      formateTime();

      intervalTime = setInterval(() => formateTime(), 1e3);
    }

    return () => {
      intervalTime && clearInterval(intervalTime);
    };
  }, [next_payout_time_left]);

  const redirectToAuth = () => {
    window.location.href = `${ENDPOINT}/other/discord/redirect?pid=${user?.pid}`;
  };

  const CheckForAdditionalZero = (num: number): string | number => {
    if (String(num).length === 0x1) {
      return `0${num}`;
    }
    return num;
  };

  const removeDiscordProperty = async () => {
    let token: string | undefined = localStorage.token;
    setButtonDelete(true);

    const removeRequest = await axios.request<RequestResponse<null>>({
      method: "DELETE",
      url: `${ENDPOINT}/users/discord/delete`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setButtonDelete(false);

    if (removeRequest.data) {
      if (removeRequest.data.status) {
        dispatch({
          type: "UPDATE_APP_STATE",
          payload: {
            user: Object.assign({}, user, { discord: null }),
          },
        });
        toast.success("Successfully removed!");
      } else {
        toast.error(removeRequest.data.msg ?? "Failed to update your property");
      }
    } else {
      toast.error("Something went wonrg on server");
    }
  };
  return (
    <div id="status-earn-page" className="page">
      <div className="title">
        <div className="wrap-behind-title"></div>
        <span>Discord Status Earn</span>
      </div>
      <div className="description">
        By adding hydrex link into your discord status, you'll be paid every
        hour automatically.
      </div>
      <div className="content">
        <div className="panel">
          {user?.discord ? (
            <div id="discord-details">
              <div
                className="banner_wrap"
                style={{
                  backgroundImage: `url(${
                    user && user.discord && user.discord.banner
                      ? `https://cdn.discordapp.com/banners/${user.discord?.id}/${user.discord.banner}.png?size=300`
                      : null
                  })`,
                }}
              >
                <div
                  className="circle-avatar"
                  style={{
                    backgroundImage: `url(${
                      user && user.discord && user.discord.avatar
                        ? `https://cdn.discordapp.com/avatars/${user.discord?.id}/${user.discord.avatar}.png`
                        : uknownImage
                    })`,
                  }}
                ></div>
              </div>
              <div className="name">
                {user?.discord ? (
                  <>
                    {user.discord.username}
                    <span>#{user.discord.discriminator}</span>
                  </>
                ) : (
                  <>
                    --<span>#0000</span>
                  </>
                )}
              </div>
              <div className="id">
                {(user?.discord && user?.discord.id) ?? "--"}
              </div>
              <div className="collected">
                (Collected {intToString(user.discord.collected ?? 0x0)}
                <img src={coinImage} alt="Hydrex coin" />)
              </div>
              <div className="bottom-section">
                <div className="button change" onClick={() => redirectToAuth()}>
                  Change
                </div>
                <div
                  className="button delete"
                  style={{ cursor: buttonDelete ? "not-allowed" : "pointer" }}
                  onClick={() => !buttonDelete && removeDiscordProperty()}
                >
                  {buttonDelete ? (
                    <div className="loader"></div>
                  ) : (
                    <img src={removeImage} alt="Clear" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div id="step-section">
              <div className="content-section">
                <div className="title">First Thing</div>
                <div className="description">
                  Connect your discord account by clicking Connect button, We
                  need connection to makesure we're giving the right amout to
                  our client.
                </div>
                <div className="button" onClick={() => redirectToAuth()}>
                  Connect
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="img">
          <img src={rightImage} alt="" />
        </div>
        <div className="panel">
          <div id="step-section">
            <div className="content-section">
              <div className="title">JOIN TO SERVER</div>
              <div className="description">
                You should join to the server because bot can't detect your
                status while you're out from the server,{" "}
                <strong>
                  If you already joined to the server just ignore it
                </strong>
                .
              </div>
              <div
                className={"button" + (joined_discord_server ? " joined" : "")}
                onClick={() => {
                  !joined_discord_server &&
                    window.open(`${ENDPOINT}/other/discord/join`);
                }}
              >
                {joined_discord_server ? "Joined" : "Join"}
              </div>
            </div>
          </div>
        </div>
        <div className="img">
          <img src={rightImage} alt="" />
        </div>
        <div className="panel">
          <div id="step-section">
            <div className="content-section">
              <div className="title">CHANGE YOUR STATUS</div>
              <div className="description">
                Add <span className="square">hydrex.me</span> to your discord
                status to receive hourly rewards, you'll receive message from
                bot that telling you "You joined into watching list", If it
                doesn't work just remove the status then add it again.
              </div>
              <div className="countdown">
                <div className="small-title">Next payout in</div>
                <div className="time">
                  {CheckForAdditionalZero(nextPayout[0x0])} <span>:</span>
                  {CheckForAdditionalZero(nextPayout[0x1])} <span>:</span>
                  {CheckForAdditionalZero(nextPayout[0x2])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
