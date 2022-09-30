import axios from "axios";
import React, { FC, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ENDPOINT, SITE_KEY } from "..";
import { Dispatch, StateInterface } from "../redux";
import { AuthReducer } from "../redux/reducers/auth.reducer";
import { getValueOfQuery } from "../utils/parseQueries";

export interface RequestResponse<Y> {
  status: boolean;
  code?: number;
  content?: Y;
  msg: string;
}

interface AuthForm {
  username: string | null;
  email: string | null;
  password: string | null;
  referredBy: string | null;
}

var form_auth: AuthForm = {
  username: null,
  email: null,
  password: null,
  referredBy: null,
};

export const Authentication: FC = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch<Dispatch<AuthReducer>>();
  const { alert, submit_button, method, wrap_alert } = useSelector<
    StateInterface,
    AuthReducer
  >((state) => state.authReducer);

  useEffect(() => {
    if (localStorage.token) {
      navigate("/dashboard");
    } else {
      let referral_id = getValueOfQuery("f", document.URL);
      if (referral_id) {
        form_auth.referredBy = referral_id;
        setAuthMethod(0x1);
      }
    }
  }, []);

  const setAuthMethod = (num: number): void => {
    clearForm();
    dispatch({
      type: "UPDATE_AUTH_STATE",
      payload: {
        method: num,
      },
    });
  };

  const setWrapAlert = (
    wrap: keyof AuthReducer["wrap_alert"],
    msg: string,
  ): void => {
    if (!(wrap in wrap_alert)) {
      return;
    }

    dispatch({
      type: "UPDATE_AUTH_STATE",
      payload: {
        wrap_alert: Object.assign({}, wrap_alert, {
          [wrap]: msg ?? null,
        }),
      },
    });
  };

  const clearForm = () => {
    dispatch({
      type: "UPDATE_AUTH_STATE",
      payload: {
        alert: null,
        submit_button: false,
        wrap_alert: {
          username: null,
          email: null,
          password: null,
        },
      },
    });
  };

  const submit = async (method_submit: number) => {
    try {
      if (method_submit !== 0x0) {
        if (
          !form_auth.username ||
          form_auth.username.length < 0x5 ||
          !/^[A-Za-z0-9.]+$/.test(form_auth.username)
        ) {
          return setWrapAlert("username", "Username is incorrect");
        }
      }

      if (!form_auth.email || !/\S+@\S+\.\S+/.test(form_auth.email)) {
        return setWrapAlert("email", "Email address is incrorrect");
      }

      if (
        !form_auth.password ||
        form_auth.password.length < 0x5 ||
        !/^[A-Za-z0-9\$\#\.@_]+$/.test(form_auth.password)
      ) {
        return setWrapAlert("password", "Password is incorrect");
      }

      dispatch({
        type: "UPDATE_AUTH_STATE",
        payload: {
          submit_button: true,
        },
      });

      const captchaToken = await (recaptchaRef.current as any).executeAsync();
      (recaptchaRef.current as any).reset();

      const requestAuth = await axios.request({
        method: "POST",
        url: `${ENDPOINT}/auth/${
          method_submit === 0x0 ? "signin" : "signup"
        }/${captchaToken}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(
          Object.assign(
            {
              email: form_auth.email.toLowerCase(),
              password: form_auth.password,
            },
            method_submit !== 0x0
              ? { username: form_auth.username?.toLowerCase() }
              : {},
            form_auth.referredBy ? { referredBy: form_auth.referredBy } : {},
          ),
        ),
      });

      clearForm();

      let data: RequestResponse<{ token: string } | undefined> =
        requestAuth.data;

      if (data && data.status && data.content && "token" in data.content) {
        localStorage.setItem("token", data.content.token);
        navigate("/dashboard");
      } else {
        dispatch({
          type: "UPDATE_AUTH_STATE",
          payload: {
            alert: data.msg ?? "Something went wrong, try again later",
          },
        });
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
        {method !== 0x0 ? (
          <div className="wrap-input">
            <div className="label">
              Username
              {wrap_alert.username ? (
                <span className="alert">- {wrap_alert.username}</span>
              ) : null}
            </div>
            <input
              type="text"
              placeholder="Username"
              maxLength={30}
              onChange={(e) => (form_auth.username = e.target.value)}
            />
          </div>
        ) : null}
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
        <div className="wrap-input">
          <div className="label">
            Password
            {wrap_alert.password ? (
              <span className="alert">- {wrap_alert.password}</span>
            ) : null}
          </div>
          <input
            type="password"
            placeholder="Password"
            maxLength={28}
            onChange={(e) => (form_auth.password = e.target.value)}
          />
        </div>

        <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} size="invisible" />

        <div className={"line-login" + (method !== 0x0 ? " signup" : "")}>
          {method === 0x0 ? (
            <span onClick={() => navigate("/recover")}>
              Forgot your password?
            </span>
          ) : (
            <span style={method !== 0x0 ? { fontSize: "12px" } : {}}>
              By clicking on the subscription, you agree to the terms and
              conditions of use.
            </span>
          )}
          <div
            className={"button" + (submit_button ? " active" : "")}
            onClick={() => !submit_button && submit(method)}
          >
            {submit_button ? (
              <div className="loader"></div>
            ) : method === 0x0 ? (
              "LOG IN"
            ) : (
              "SIGN UP"
            )}
          </div>
        </div>

        <div className="line"></div>
        {method === 0x0 ? (
          <span>Don't have an account?</span>
        ) : (
          <span>I already have an account?</span>
        )}
        <div
          className="button-mirror"
          onClick={() => setAuthMethod(method === 0x0 ? 0x1 : 0x0)}
        >
          {method !== 0x0 ? "LOG IN" : "SIGN UP"} FOR HYDREX
        </div>
        {/* <div className="line-2"></div> + google auth */}
      </div>
    </div>
  );
};
