import React, { useEffect, useState } from "react";
import { FC } from "react";
import toast from "react-hot-toast";
import { intToString } from "../../../../utils/format_number";
import { useDispatch, useSelector } from "react-redux";
import { StateInterface, Dispatch } from "../../../../redux";
import { AppReducer } from "../../../../redux/reducers/app.reducer";

import btcImage from "../../../../assets/img/bitcoin-logo.png";
import coinImage from "../../../../assets/img/coin.svg";
import btcCoin from "../../../../assets/img/bitcoinLogoShort.svg";
import axios from "axios";

export const BitcoinCheckout: FC = () => {
  const dispatch = useDispatch<Dispatch<AppReducer & { target?: string }>>();
  const { checkout_content, configs } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  useEffect(() => {
    let btc_address = localStorage.btc_address;
    if (btc_address) {
      updateTargetClient(btc_address);
    }

    fetchBitcoinPrice();
  }, []);

  const fetchBitcoinPrice = async () => {
    const fetchPrice = await axios.request<{
      data: { base: string; currency: string; amount: string };
    }>({
      url: "https://api.coinbase.com/v2/prices/spot?currency=USD",
    });

    if (
      fetchPrice.data &&
      "data" in fetchPrice.data &&
      "amount" in fetchPrice.data.data
    ) {
      updateTargetClient(null, Number(fetchPrice.data.data.amount));
    } else {
      toast.error("Failed to fetch Bitcoin price");
    }
  };

  const updateTargetClient = (prop: string | null, btc_price?: number) => {
    dispatch({
      type: "UPDATE_CHECKOUT_STATE",
      payload: Object.assign(
        prop
          ? {
              target: prop,
            }
          : {},
        btc_price ? { btc_price } : {},
      ),
    });
  };

  const setAmount = (amount: number) => {
    dispatch({
      type: "UPDATE_APP_STATE",
      payload: {
        checkout_content: Object.assign(checkout_content, { amount: amount }),
      },
    });
  };

  const saveAddress = () => {
    if (
      !checkout_content.target_user ||
      !checkout_content.target_user.length ||
      !/^[A-Za-z0-9]+$/.test(checkout_content.target_user)
    ) {
      return toast.error("incorrect address");
    }

    localStorage.setItem("btc_address", checkout_content.target_user);

    toast.success("Your Address saved successfully");
  };

  return (
    <div id="btc-content" className="checkout-content-inside">
      <div className="bar-title">
        <div className="logo">
          <img src={btcImage} />
        </div>
        <div className="description">
          Crypto withdrawals take a few minutes to be completed.
        </div>
      </div>
      <div className="line"></div>
      <div className="input-form">
        <div className="label blowed">
          <span>WALLET ADDRESS</span>
          <span>Make sure the network is Bitcoin</span>
        </div>
        <div className="second-line">
          <input
            type="text"
            placeholder="Enter your address"
            defaultValue={checkout_content.target_user ?? ""}
            onChange={(e) => updateTargetClient(e.target.value)}
          />
          <div className="button-save" onClick={() => saveAddress()}>
            SAVE
          </div>
        </div>
      </div>
      <div className="input-form">
        <div className="label blowed">
          <span>AMOUNT</span>
          <span>
            Minimum: {intToString((configs?.perOneDollar ?? 0x0) * 0x5)}{" "}
            <img src={coinImage} /> ($5.00).
          </span>
        </div>

        <div className="second-line info">
          <input
            type="number"
            placeholder="Enter amount"
            defaultValue={checkout_content.amount ?? ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <div className="detail" onClick={() => fetchBitcoinPrice()} title="Refresh">
            <span id="btc">
              <img src={btcCoin} />
              <div className="span">BTC RATE</div>
            </span>
            <span>{intToString(checkout_content.priceBTC ?? 0x0)}$</span>
          </div>
        </div>
      </div>
    </div>
  );
};
