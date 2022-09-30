import React, { useEffect } from "react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT } from "../..";

import coinImage from "../../assets/img/coin.svg";
import { Dispatch, StateInterface } from "../../redux";
import { AppReducer, Transaction } from "../../redux/reducers/app.reducer";

export const TransactionsSection: FC = () => {
  // const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { transactions } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );
 

  return (
    <div id="transactions">
      {transactions ? (
        transactions?.map((tran, i) =>
          tran ? (
            <div className="transactions-content">
              <div className="trans" key={i}>
                <div
                  className="square-avatar"
                  style={{ backgroundImage: `url(${tran.avatar})` }}
                ></div>
                <div className="details">
                  <div className="method">{tran.method}</div>
                  <div className="name">
                    {tran.username && tran.username.length >= 8
                      ? tran.username.slice(0x0, 0x8) + ".."
                      : tran.username}
                  </div>
                </div>
                <div className="amount">
                  {tran.amount} <img src={coinImage} />
                </div>
              </div>
            </div>
          ) : null,
        )
      ) : (
        <div className="loader">
          <div></div>
        </div>
      )}
    </div>
  );
};
