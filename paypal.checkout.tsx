import React, { useEffect, useState } from "react";
import { FC } from "react";

import { useDispatch, useSelector } from "react-redux";
import { StateInterface, Dispatch } from "../../../../redux";
import { AppReducer } from "../../../../redux/reducers/app.reducer";

import paypalImage from "../../../../assets/img/paypal.svg";
import coinImage from "../../../../assets/img/coin.svg";
import toast from "react-hot-toast";

export const PaypalCheckout: FC = () => {
  const dispatch = useDispatch<Dispatch<AppReducer & { target?: string }>>();
  const { checkout_content, configs } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  useEffect(() => {
    let email_stored = localStorage.paypal_email;
    if (email_stored) {
      updateTargetClient(email_stored);
    }
  }, []);

  const updateTargetClient = (prop: string) => {
    dispatch({
      type: "UPDATE_CHECKOUT_STATE",
      payload: {
        target: prop,
      },
    });
  };

  const setCardAmount = (amount: number) => {
    alert(amount)
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        checkout_content: Object.assign(checkout_content, { amount: amount }),
      },
    });
  };

  const saveEmail = () => {
    if (
      !checkout_content.target_user ||
      !checkout_content.target_user.length ||
      !/\S+@\S+\.\S+/.test(checkout_content.target_user)
    ) {
      return toast.error("incorrect email");
    }

    localStorage.setItem("paypal_email", checkout_content.target_user);

    toast.success("Your email saved successfully");
  };

  return (
    <div id="paypal-content" className="checkout-content-inside">
      <div className="bar-title">
        <div className="logo">
          <img src={paypalImage} />
        </div>
        <div className="description">
          PayPal withdrawals have a flat fee of 5%. After withdrawing claim your
          PayPal Cashout on your profile.
        </div>
      </div>
      <div className="line"></div>
      <div className="input-form">
        <div className="label">
          <span>YOUR EMAIL</span>
        </div>
        <div className="second-line">
          <input
            type="text"
            placeholder="Your email"
            defaultValue={checkout_content.target_user ?? ""}
            onChange={(e) => updateTargetClient(e.target.value)}
          />
          <div className="button-save" onClick={() => saveEmail()}>
            SAVE
          </div>
        </div>
      </div>
      <div className="label blowed">
        <span>AMOUNT CARDS</span>
        <span>
          (1$ ≈ {configs?.perOneDollar} <img src={coinImage} />)
        </span>
      </div>
      <div className="cards">
        {((configs && configs.cash_allowed["paypal"].cards) ?? []).map(
          (amount, i) => (
            <div
              className={
                "card" + (checkout_content.amount === amount ? " active" : "")
              }
              key={i}
              onClick={() => setCardAmount(amount)}
            >
              <span>{amount}$</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
};
