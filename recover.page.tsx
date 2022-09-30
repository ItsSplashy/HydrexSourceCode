import axios from "axios";
import React, { FC, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ENDPOINT, SITE_KEY } from "..";
import { Dispatch, StateInterface } from "../redux";
import { RecoverReducer } from "../redux/reducers/recover.reducer";

export interface RequestResponse<Y = null> {
  status: boolean;
  code?: number;
  content?: Y;
  msg: string;
}

interface RecoverForm {
  email: string | null;
  code: string | null;
  password: string | null;
}

var form_auth: RecoverForm = {
  email: null,
  code: null,
  password: null,
};

export const RecoverPage: FC = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch<Dispatch<RecoverReducer>>();
  const { alert, submit_button, method, wrap_alert } = useSelector<
    StateInterface,
    RecoverReducer
  >((state) => state.recoverReducer);

  useEffect(() => {
    if (localStorage.token) {
      navigate("/dashboard");
    }
  }, []);

  const setWrapAlert = (
    wrap: keyof RecoverReducer["wrap_alert"],
    msg: string,
  ): void => {
    if (!(wrap in wrap_alert)) {
      return;
    }

    dispatch({
      type: "UPDATE_RECOVER_STATE",
      payload: {
        wrap_alert: Object.assign({}, wrap_alert, {
          [wrap]: msg ?? null,
        }),
      },
    });
  };

  const clearForm = () => {
    dispatch({
      type: "UPDATE_RECOVER_STATE",
      payload: {
        alert: null,
        submit_button: false,
        wrap_alert: {
          email: null,
          password: null,
          code: null,
        },
      },
    });
  };

  const submit = async (method_submit: number) => {
    try {
      if (!form_auth.email || !/\S+@\S+\.\S+/.test(form_auth.email)) {
        return setWrapAlert("email", "Email address is incrorrect");
      }

      if (method_submit !== 0x0) {
        if (
          !form_auth.code ||
          form_auth.code.length < 0x8 ||
          !/^[A-Z0-9]+$/.test(form_auth.code)
        ) {
          return setWrapAlert("code", "Verification code is incorrect");
        }

        if (
          !form_auth.password ||
          form_auth.password.length < 0x5 ||
          !/^[A-Za-z0-9\$\#\.@_]+$/.test(form_auth.password)
        ) {
          return setWrapAlert("password", "Password is incorrect");
        }
      }

      // clearForm();

      dispatch({
        type: "UPDATE_RECOVER_STATE",
        payload: {
          submit_button: true,
        },
      });

      const captchaToken = await (recaptchaRef.current as any).executeAsync();
      (recaptchaRef.current as any).reset();

      const requestAuth = await axios.request({
        method: "POST",
        url: `${ENDPOINT}/auth/${
          method_submit !== 0x0 ? "recover_password" : "verify"
        }/${captchaToken}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(
          Object.assign(
            {
              email: form_auth.email.toLowerCase(),
            },
            method_submit !== 0x0
              ? { code: form_auth.code, password: form_auth.password }
              : {},
          ),
        ),
      });

      clearForm();

      let data: RequestResponse<{ token?: string } | undefined> =
        requestAuth.data;

      if (method_submit === 0x0) {
        if (data && data.status) {
          dispatch({
            type: "UPDATE_RECOVER_STATE",
            payload: {
              method: 0x1,
            },
          });
        } else {
          dispatch({
            type: "UPDATE_RECOVER_STATE",
            payload: {
              alert: data.msg ?? "Something went wrong",
            },
          });
        }
      } else {
        if (
          data &&
          data.status &&
          data.content &&
          "token" in data.content &&
          data.content.token
        ) {
          localStorage.setItem("token", data.content.token);
          navigate("/dashboard");
        } else {
          dispatch({
            type: "UPDATE_RECOVER_STATE",
            payload: {
              alert: data.msg ?? "Something went wrong, try again later",
            },
          });
        }
      }
    } catch (e) {
      (recaptchaRef.current as any).reset();
      console.log(String(e));
    }
  };

  return (
    <div id="auth" className="container">
      <div className="panel">
        <div className="logo">HYDREX</div>
        <div className="description">
          Right way to make money. Save your time!
        </div>
        {alert ? <div className="alert-generale">{alert}</div> : null}

        {method === 0x0 ? (
          <div className="wrap-input">
            <div className="label">
              Email address
              {wrap_alert.email ? (
                <span className="alert">- {wrap_alert.email}</span>
              ) : null}
            </div>
            <input
              type="email"
              placeholder="Email address"
              maxLength={30}
              onChange={(e) => (form_auth.email = e.target.value)}
            />
          </div>
        ) : (
          <>
            <div className="wrap-input">
              <div className="label">
                Verification code
                {wrap_alert.code ? (
                  <span className="alert">- {wrap_alert.code}</span>
                ) : null}
              </div>
              <input
                type="text"
                placeholder="Verification code"
                maxLength={8}
                onChange={(e) => (form_auth.code = e.target.value)}
              />
            </div>
            <div className="wrap-input">
              <div className="label">
                New Password
                {wrap_alert.password ? (
                  <span className="alert">- {wrap_alert.password}</span>
                ) : null}
              </div>
              <input
                type="password"
                placeholder="New Password"
                maxLength={28}
                onChange={(e) => (form_auth.password = e.target.value)}
              />
            </div>
          </>
        )}

        <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} size="invisible" />

        <div className={"line-login signup"}>
          <span style={{ fontSize: "12px" }}>
            {method === 0x0
              ? "Enter your Hydrex email address that you used to register. We'll send you an email with verification code to reset your password."
              : "Please check you inbox for verification code, If you didn't find it try check Spam folder"}
          </span>
          <div
            className={"button" + (submit_button ? " active" : "")}
            onClick={() => !submit_button && submit(method)}
          >
            {submit_button ? (
              <div className="loader"></div>
            ) : method === 0x0 ? (
              "Reset"
            ) : (
              "Change"
            )}
          </div>
        </div>

        <div className="line"></div>
        <br />
        <div className="button-mirror" onClick={() => navigate("/auth")}>
          BACK TO LOGIN PAGE
        </div>
      </div>
    </div>
  );
};
