import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "../../../../redux";
import { AppReducer } from "../../../../redux/reducers/app.reducer";

import coinImage from "../../../../assets/img/coin.svg";
import { intToString } from "../../../../utils/format_number";
import toast from "react-hot-toast";
import axios from "axios";
import { ENDPOINT } from "../../../..";
import { useNavigate } from "react-router-dom";
import { RequestResponse } from "../../../../pages/recover.page";

interface FormInputs {
  currentPassword: string | null;
  newPassword: string | null;
  repeatPassword: string | null;
}

var form_inputs: FormInputs = {
  repeatPassword: null,
  currentPassword: null,
  newPassword: null,
};

export const ChangePasswordSettings: FC = () => {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);

  const saveDetails = async () => {
    if (
      !form_inputs.currentPassword ||
      form_inputs.currentPassword.length < 0x5 ||
      !/^[A-Za-z0-9\$\#\.@_]+$/.test(form_inputs.currentPassword)
    ) {
      return toast.error("Current password is incorrect");
    }

    if (
      !form_inputs.newPassword ||
      form_inputs.newPassword.length < 0x5 ||
      !/^[A-Za-z0-9\$\#\.@_]+$/.test(form_inputs.newPassword)
    ) {
      return toast.error("New password is incorrect");
    }

    if (
      !form_inputs.repeatPassword ||
      form_inputs.repeatPassword !== form_inputs.newPassword
    ) {
      return toast.error("Password doesn't match");
    }

    let token: string | undefined = localStorage.token;

    if (!token) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }

    setButtonLoading(true);

    let passUpdated = await axios.request<RequestResponse>({
      url: `${ENDPOINT}/users/changepassword`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(form_inputs),
    });

    setButtonLoading(false);

    if (passUpdated.data && passUpdated.data.status) {
      form_inputs = {
        repeatPassword: null,
        currentPassword: null,
        newPassword: null,
      };
      toast.success(passUpdated.data.msg ?? "Password changed successfully");
    } else {
      toast.error(passUpdated.data.msg ?? "Failed to change your password");
    }
  };

  return (
    <div id="change-password" className="setting-container">
      <div className="label">CHANGE PASSWORD</div>
      <div className="input-form">
        <div className="label-input">CURRENT PASSWORD</div>
        <input
          type="password"
          placeholder="Enter your current password"
          defaultValue={form_inputs.currentPassword ?? ""}
          onChange={(e) => (form_inputs.currentPassword = e.target.value)}
        />
      </div>
      <div className="input-form">
        <div className="label-input">NEW PASSWORD</div>
        <input
          type="password"
          placeholder="Enter your new password"
          defaultValue={form_inputs.newPassword ?? ""}
          onChange={(e) => (form_inputs.newPassword = e.target.value)}
        />
      </div>
      <div className="input-form">
        <div className="label-input">REPEAT NEW PASSWORD</div>
        <input
          type="password"
          placeholder="Repeat your new  password"
          defaultValue={form_inputs.repeatPassword ?? ""}
          onChange={(e) => (form_inputs.repeatPassword = e.target.value)}
        />
      </div>
      <div
        className="button-save"
        style={{ cursor: buttonLoading ? "not-allowed" : "pointer" }}
        onClick={() => !buttonLoading && saveDetails()}
      >
        {!buttonLoading ? <>Change</> : <div className="loader"></div>}
      </div>
    </div>
  );
};
