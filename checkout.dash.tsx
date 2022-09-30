import React from "react";
import { FC } from "react";

import { useDispatch, useSelector } from "react-redux";
import { StateInterface, Dispatch } from "../../../redux";
import { AppReducer } from "../../../redux/reducers/app.reducer";
import { PaypalCheckout } from "./checkout/paypal.checkout";

import shopeImage from "../../../assets/img/shope.svg";
import backImage from "../../../assets/img/back.svg";
import coinImage from "../../../assets/img/coin.svg";
import { intToString } from "../../../utils/format_number";
import { BitcoinCheckout } from "./checkout/bitcoin.checkout";

export const CheckOutPage: FC = () => {
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { checkout_content, configs } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  const setCheckoutContent = (num: number) => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        container_dash: num,
        checkout_content: Object.assign(checkout_content, {
          type_content: 0x0,
        }),
      },
    });
  };

  const amount =
    checkout_content.type_content === 0x2
      ? (checkout_content.amount ?? 0x0) / (configs?.perOneDollar ?? 0x0)
      : checkout_content.amount ?? 0x0;

  const fee = amount * (configs?.fee ?? 0x0);

  const FinarCheckout = () => {
    return (
      <div className="final-checkout">
        <div className="content">
          <div className="fee-section bowled">
            <div className="label">Fee</div>
            <div className="amount">{intToString(fee, true)}$</div>
          </div>
          <div className="final-amount bowled">
            <div className="label">
              {checkout_content.type_content === 0x2
                ? "You'll receive"
                : "Coin Price"}
            </div>
            <div className="amount">
              {checkout_content.type_content === 0x2 ? (
                <>
                  {amount < 0x1
                    ? "--"
                    : (
                        (amount - fee) /
                        (checkout_content.priceBTC ?? 0x0)
                      ).toFixed(0x5)}{" "}
                  BTC
                </>
              ) : (
                <>
                  {checkout_content.type_content === 0x1
                    ? intToString(
                        ((amount ?? 0x0) + fee) *
                          (configs?.perOneDollar ?? 0x0),
                      )
                    : amount}{" "}
                  <img src={coinImage} alt="Hydrex points" />
                </>
              )}
            </div>
          </div>
          <div className="line"></div>
          <div className="button">Withdraw</div>
        </div>
      </div>
    );
  };
  return (
    <div id="checkout-page">
      <div className="back-section" onClick={() => setCheckoutContent(0x3)}>
        <div className="content">
          <img src={backImage} /> <span>Back to Shop</span>
          <img src={shopeImage} />
        </div>
      </div>
      <div className="checkout-content">
        <div className="content-reward-withdraw">
          {checkout_content.type_content === 0x1 ? <PaypalCheckout /> : null}
          {checkout_content.type_content === 0x2 ? <BitcoinCheckout /> : null}
        </div>
        <FinarCheckout />
      </div>
    </div>
  );
};
