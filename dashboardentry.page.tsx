import axios from "axios";
import { writeSync } from "fs";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ENDPOINT } from "..";
import { DashboardContent } from "../components/dashboard/dashboard.content";
import { EmailVerifyComp } from "../components/dashboard/verifyEmail";
import { LoaderScreen } from "../main/loader";
import { Dispatch, StateInterface } from "../redux";
import { AppReducer } from "../redux/reducers/app.reducer";
import { BinaryWriter } from "../utils/binary_packet";
import { clientPacketUtil } from "../utils/clientPacket.util";
import { RequestResponse } from "./authentication.page";

var ws_connected: boolean = false;

export const Dashboard: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { user } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  useEffect(() => {
    let ws: WebSocket | null = null;
    let token: string | undefined = localStorage.token;

    if (!token) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }

    (async () => {
      let userData = await axios.request({
        url: `${ENDPOINT}/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let data: RequestResponse<
        AppReducer["user"] & { configs: AppReducer["configs"] }
      > = userData.data;

      if (data && data.status && data.content && "pid" in data.content) {
        let configs: AppReducer["configs"] | null =
          "configs" in data.content ? data.content?.configs ?? null : null;

        if (configs) {
          delete data.content["configs"];
        }

        if (data.content.avatar === "default") {
          data.content.avatar = `https://eu.ui-avatars.com/api/?background=222233&color=6139e6&length=1&name=${data.content.email}`;
        }

        dispatch({
          type: "UPDATE_APP_STATE",
          payload: Object.assign(
            {
              user: data.content,
            },
            configs ? { configs } : {},
          ),
        });

        (window as any).wsocket = ws = new WebSocket(
          `${
            "https:" === window.location.protocol ? "wss" : "ws"
          }://${ENDPOINT.replace(/(https?)+\:\/\//, "")}/gateaway?pid=${
            data.content.pid
          }`,
        );

        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
          if (data.content) {
            console.log("[Websocket] Connected to Server");
            let bnf = new BinaryWriter();
            bnf.setUint8(254).setStringZeroUtf8(data.content.ws_key);
            ws && ws.send(bnf.build());
          }
        };

        ws.onmessage = clientPacketUtil;

        ws.onclose = (event: CloseEvent) => {
          if (event.code === 1e3) {
            let message: string = "";

            switch (event.reason) {
              case "IP limit reached":
                message = "IP limit reached";
                break;
              case "No slots":
                message =
                  "You can't access to the website currently, try later";
                break;
            }

            if (message) {
              dispatch({
                type: "UPDATE_APP_STATE",
                payload: {
                  error_page_content: {
                    title: "System Message",
                    msg: message,
                  },
                },
              });
            }
          }
        };
      } else {
        if (data && data.status === false && data.code === 0x1) {
          dispatch({
            type: "UPDATE_APP_STATE",
            payload: {
              error_page_content: {
                title: "System Message",
                msg: "Your account is suspended",
              },
            },
          });
        } else if (data && data.status === false && data.code === 0x2) {
          dispatch({
            type: "UPDATE_APP_STATE",
            payload: {
              user: Object.assign({}, user, { verified: false }),
            },
          });
        } else {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      }
    })();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  if (!user) {
    return <LoaderScreen />;
  }

  return user?.verified ? <DashboardContent /> : <EmailVerifyComp />;
};
