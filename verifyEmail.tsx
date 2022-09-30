import axios from "axios";
import React, { FC, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ENDPOINT, SITE_KEY } from "../..";
import { RequestResponse } from "../../pages/authentication.page";
import { Dispatch, StateInterface } from "../../redux";
import { AppReducer } from "../../redux/reducers/app.reducer";

var form: AppReducer["wrap_alert_verify"] = {
  code: null,
};

export const EmailVerifyComp: FC = () => {
  const navigate = useNavigate();
  const token = localStorage.token;
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { wrap_alert_verify, user, submit_button_verify, alert_verify } =
    useSelector<StateInterface, AppReducer>((state) => state.appReducer);

  useEffect(() => {
    if (user?.verified) {
      return navigate("/dashboard");
    }

    (async () => {
      const captchaToken = await (recaptchaRef.current as any).executeAsync();
      (recaptchaRef.current as any).reset();

      const requestSendEmail = await axios.request({
        method: "POST",
        url: `${ENDPOINT}/users/verifyemail/${captchaToken}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let data: RequestResponse<null> = requestSendEmail.data;

      if (data && data.status) {
        setAlertGenerale(true, "We sent you an email with a verification code");
      } else {
        setAlertGenerale(false, data.msg ?? "Something went wrong");
      }
    })();
  }, []);

  const setAlertGenerale = (type: boolean, msg: string) => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        alert_verify: {
          type,
          msg,
        },
      },
    });
  };

  const setWrapAlert = (
    wrap: keyof AppReducer["wrap_alert_verify"],
    msg: string,
  ): void => {
    if (!(wrap in wrap_alert_verify)) {
      return;
    }
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        wrap_alert_verify: Object.assign({}, wrap_alert_verify, {
          [wrap]: msg ?? null,
        }),
      },
    });
  };

  const submit = async () => {
    if (
      !form.code ||
      form.code.length < 0x8 ||
      !/^[A-Z0-9]+$/.test(form.code)
    ) {
      return setWrapAlert("code", "Verification code is incorrect");
    }

    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        submit_button_verify: true,
      },
    });

    const captchaToken = await (recaptchaRef.current as any).executeAsync();
    (recaptchaRef.current as any).reset();

    const requestCodeValidate = await axios.request({
      method: "POST",
      url: `${ENDPOINT}/users/validatecode/${captchaToken}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({ code: form.code }),
    });

    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        submit_button_verify: false,
      },
    });

    let data: RequestResponse<null> = requestCodeValidate.data;

    if (data && data.status) {
      location.reload();
    } else {
      dispatch({
        type: "UPDATE_APP_STATE",
        payload: {
          alert_verify: {
            type: false,
            msg: data.msg ?? "Something went wrong",
          },
        },
      });
    }
  };

  return (
    <div id="auth" className="container">
      <div className="panel">
        <div className="logo">HYDREX</div>
        <div className="description">
          Right way to make money. Save your time!
        </div>
        {alert_verify.msg ? (
          <div
            className={"alert-generale" + (alert_verify.type ? " success" : "")}
          >
            {alert_verify.msg}
          </div>
        ) : null}

        <div className="wrap-input">
          <div className="label">
            Verification Code
            {wrap_alert_verify.code ? (
              <span className={"alert"}>- {wrap_alert_verify.code}</span>
            ) : null}
          </div>
          <input
            type="text"
            placeholder="Verification code"
            maxLength={8}
            onChange={(e) => (form.code = e.target.value)}
          />
        </div>

        <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} size="invisible" />

        <div className={"line-login signup"}>
          <span style={{ fontSize: "12px" }}>
            Please check you inbox for verification code, If you didn't find it
            try check Spam folder
          </span>
          <div
            className={"button" + (submit_button_verify ? " active" : "")}
            onClick={() => !submit_button_verify && submit()}
          >
            {submit_button_verify ? <div className="loader"></div> : "Verify"}
          </div>
        </div>
      </div>
    </div>
  );
};
