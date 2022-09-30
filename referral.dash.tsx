import React, { FC, useRef } from "react";
import { useSelector } from "react-redux";
import { CLIENTURI } from "../../..";
import { StateInterface } from "../../../redux";
import { AppReducer } from "../../../redux/reducers/app.reducer";

import copyImage from "../../../assets/img/copy.svg";
import coinImage from "../../../assets/img/coin.svg";
import toast from "react-hot-toast";
import { intToString } from "../../../utils/format_number";

export const ReferralPage: FC = () => {
  const linkRef = useRef<HTMLInputElement>(null);

  const { user } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );
  const refLink: string = `${CLIENTURI}/?f=${user?.pid}`;

  return (
    <div id="referral-page" className="page">
      <div className="title">
        <div className="wrap-behind-title"></div>
        <span>Invite friends</span>
      </div>
      <div className="description">
        Invite you friends to earn profit like 10 percent of each offer they
        make.
      </div>
      <div className="link-section">
        <div className="label">
          Your invite link
          <span>- Use the link with your id to earn more points!</span>
        </div>
        <div className="input-section">
          <input
            type="text"
            placeholder="your invite link"
            ref={linkRef}
            defaultValue={refLink}
          />
          <div
            className="copy-button"
            title="copy"
            onClick={() => {
              linkRef.current?.select();
              linkRef.current?.setSelectionRange(0, 99999);
              navigator.clipboard.writeText(linkRef.current?.value ?? "");
              toast.success("link copied successfully");
            }}
          >
            <img src={copyImage} alt="copy link" />
          </div>
        </div>
      </div>
      <div className="line"></div>
      <div className="cards">
        <div className="card">
          <div className="center">
            <div className="answer">
              {intToString(user?.referrer.invitesDone.length ?? 0x0)}
            </div>
            <div className="label">Invites</div>
          </div>
        </div>
        <div className="card">
          <div className="center">
            <div className="answer">
              {intToString(user?.referrer.collected ?? 0x0)}{" "}
              <img src={coinImage} alt="hydrex points" />
            </div>
            <div className="label">Points collected</div>
          </div>
        </div>
      </div>
    </div>
  );
};
