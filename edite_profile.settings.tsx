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
  username: string | null;
  email: string | null;
  password: string | null;
}

var form_inputs: FormInputs = {
  username: null,
  email: null,
  password: null,
};

export const EditeProfileSettings: FC = () => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [fillBar, setFillBar] = useState(0x0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { configs, settings_content, user } = useSelector<
    StateInterface,
    AppReducer
  >((state) => state.appReducer);

  useEffect(() => {
    form_inputs = {
      username: user?.username ?? null,
      email: user?.email ?? null,
      password: null,
    };
  }, [user]);

  const saveDetails = async () => {
    console.log("sb");
    if (
      !form_inputs.username ||
      form_inputs.username.length < 0x5 ||
      !/^[A-Za-z0-9.]+$/.test(form_inputs.username)
    ) {
      return toast.error("Username is incorrect");
    }

    if (!form_inputs.email || !/\S+@\S+\.\S+/.test(form_inputs.email)) {
      return toast.error("Email address is incrorrect");
    }

    if (
      !form_inputs.password ||
      form_inputs.password.length < 0x5 ||
      !/^[A-Za-z0-9\$\#\.@_]+$/.test(form_inputs.password)
    ) {
      return toast.error("Password is incorrect");
    }

    let token: string | undefined = localStorage.token;

    if (!token) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }

    setButtonLoading(true);

    let detailedUpdated = await axios.request<RequestResponse>({
      url: `${ENDPOINT}/users/editeprofile`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(form_inputs),
    });

    setButtonLoading(false);

    if (detailedUpdated.data && detailedUpdated.data.status) {
      toast.success(
        detailedUpdated.data.msg ?? "Detailes Updated successfully",
      );

      dispatch({
        type: "UPDATE_APP_STATE",
        payload: {
          user: Object.assign({}, user, {
            username: form_inputs.username,
            email: form_inputs.email,
            verified: form_inputs.email !== user?.email ? false : user.verified,
          }),
        },
      });
    } else {
      toast.error(detailedUpdated.data.msg ?? "Failed to update your details");
    }
  };

  const uploadAvatar = (files: FileList | null) => {
    if (!files) {
      return toast.error("Failed to upload your file");
    }

    const file = files[0x0];

    if (!file.type.match(/image-*/)) {
      return toast.error("Invalid format");
    }

    const size = file.size / 1024 / 1024;

    if (!size || size > 0x5) {
      return toast.error("You can't upload an image more than 5MB");
    }

    const reader = new FileReader();

    reader.addEventListener(
      "load",
      async () => {
        let token: string | undefined = localStorage.token;

        if (!reader.result) {
          return toast.error("Couldn't transform this image to base64");
        }

        let uploadImage = await axios.request<RequestResponse<{ url: string }>>(
          {
            url: `${ENDPOINT}/users/uploadavatar`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          
            onUploadProgress: (progressEvent) => {
              let pr = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setFillBar(pr >= 100 ? 0x0 : pr);
            },
            data: JSON.stringify({ image: reader.result }),
          },
        );

        let data = uploadImage.data;

        if (data && data.status) {
          toast.success(data.msg);
          dispatch({
            type: "UPDATE_APP_STATE",
            payload: {
              user: Object.assign({}, user, { avatar: data.content?.url }),
            },
          });
        } else {
          toast.error(data.msg ?? "Failed to upload your avatar");
        }
      },
      false,
    );

    reader.readAsDataURL(file);
  };

  return (
    <div id="edite-profile" className="setting-container">
      {fillBar && fillBar < 100 ? (
        <div className="fill_upload">
          <div style={{ width: fillBar + "%" }}></div>
        </div>
      ) : null}

      <input
        type="file"
        ref={avatarRef}
        accept="image/*"
        onChange={(e) => uploadAvatar(e.target.files ?? null)}
        style={{ visibility: "hidden", opacity: 0 }}
      />
      <div className="label">ACCOUNT DETAILS</div>
      <div className="card">
        <div className="avatar square">
          <div
            className="circle"
            style={{ backgroundImage: `url(${user?.avatar ?? ""})` }}
          >
            <div
              className="change-wrap"
              onClick={() => avatarRef && avatarRef.current?.click()}
            >
              change
            </div>
          </div>
        </div>
        <div className="text-section">
          <div className="wrap">
            <div className="answer colored">{user?.username ?? "--"}</div>
            <div className="answer hidden">{user?.pid ?? "--"}</div>
          </div>
          <div className="answer">{user?.email ?? "--"}</div>
          <div className="answer">
            Balance <span>{intToString(user?.balance ?? 0x0)}</span>{" "}
            <img src={coinImage} />
          </div>
        </div>
        <div className="level square">
          <div className="content">
            <div className="level-text">
              {intToString(user?.level ?? 0x0)} LEVEL
            </div>
            <div className="xp">
              {intToString(user?.xp ?? 0x0)} /{" "}
              {intToString(user?.total_xp ?? 0x0)}
            </div>
            <div className="fillbar">
              <div
                style={{
                  width: ((user?.xp ?? 0x0) * 100) / (user?.xp ?? 0x0) + "%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="label">Edite profile</div>
      <div className="input-form">
        <div className="label-input">USERNAME</div>
        <input
          type="text"
          placeholder="Enter your username"
          onChange={(e) => (form_inputs.username = e.target.value)}
          defaultValue={user?.username ?? ""}
        />
      </div>
      <div className="input-form">
        <div className="label-input">EMAIL ADDRESS</div>
        <input
          type="text"
          placeholder="Enter your email address"
          onChange={(e) => (form_inputs.email = e.target.value)}
          defaultValue={user?.email ?? ""}
        />
      </div>

      <div className="input-form">
        <div className="label-input">YOUR PASSWORD</div>
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => (form_inputs.password = e.target.value)}
        />
      </div>

      <div
        className="button-save"
        style={{ cursor: buttonLoading ? "not-allowed" : "pointer" }}
        onClick={() => !buttonLoading && saveDetails()}
      >
        {!buttonLoading ? <>Save</> : <div className="loader"></div>}
      </div>
    </div>
  );
};
