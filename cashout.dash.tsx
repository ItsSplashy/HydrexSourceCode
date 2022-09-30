import React, { FC } from "react";

import paypalImage from "../../../assets/img/paypal.svg";
import rbxImage from "../../../assets/img/robux.png";
import btcImage from "../../../assets/img/bitcoin-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "../../../redux";
import { AppReducer, Configs } from "../../../redux/reducers/app.reducer";
import styled from "styled-components";

const Card = styled.div<{ allowed: boolean; maincolor?: string }>`
  ${({ maincolor }) =>
    maincolor ? `background: ${maincolor} !important;` : ""}
  cursor: ${({ allowed }) => (allowed ? "pointer" : "not-allowed")} !important;
  opacity: ${({ allowed }) => (allowed ? "1" : ".5")};
`;

export const CashOutPage: FC = () => {
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { configs } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  const setCheckoutContent = (num: number) => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        container_dash: -1,
        checkout_content: {
          type_content: num,
        },
      },
    });
  };

  return (
    <div id="cashout" className="page">
      <div className="title">
        <div className="wrap-behind-title"></div>
        <span>Cashout</span>
      </div>
      <div className="description">
        Use your earned coins to withdraw PayPal, Bitcoin, VISA, Amazon and much
        more!
      </div>

      <div className="rewards-content">
        <div className="label">WITHDRAW CASH</div>
        {configs ? (
          <div className="cards">
            <Card
              id="paypal"
              className="card"
              onClick={() => setCheckoutContent(0x1)}
              allowed={configs.cash_allowed["paypal"].allowed ?? false}
            >
              <img src={paypalImage} alt="Paypal" />
            </Card>
            <Card
              id="btc"
              className="card"
              onClick={() => setCheckoutContent(0x2)}
              allowed={configs.cash_allowed["bitcoin"].allowed ?? false}
            >
              <img src={btcImage} alt="Bitcoin" />
            </Card>

            <Card
              id="robux"
              className="card"
              allowed={configs.cash_allowed["robux"].allowed ?? false}
            >
              <img src={rbxImage} alt="Robux" />
            </Card>
          </div>
        ) : (
          <span>There's no gift cards</span>
        )}

        <div className="label">GIFT CARDS</div>

        <div className="cards">
          {configs ? (
            Object.keys(configs?.gift_cards).map((giftKey: string, i) => (
              <Card
                id={giftKey}
                className="card"
                key={i}
                allowed={configs.gift_cards[giftKey].allowed}
                maincolor={configs.gift_cards[giftKey].color}
              >
                <img src={configs.gift_cards[giftKey].image} alt={giftKey} />
              </Card>
            ))
          ) : (
            <span>There's no gift cards</span>
          )}
        </div>
      </div>
    </div>
  );
};
