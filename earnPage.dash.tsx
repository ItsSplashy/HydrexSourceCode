import React from "react";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { StateInterface } from "../../../redux";
import { AppReducer } from "../../../redux/reducers/app.reducer";
import { Pagination } from "swiper";

import adgateImage from "../../../assets/img/dash/adgate.png";
import monlixImage from "../../../assets/img/dash/monlix.png";
import adgemImage from "../../../assets/img/dash/adgem.png";
import dailyProfitsImage from "../../../assets/img/daily_profits.png";
import lastBalanceImage from "../../../assets/img/last_balance.png";
import coinImage from "../../../assets/img/coin.svg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/bundle";
import { intToString } from "../../../utils/format_number";
import { useSelector } from "react-redux";

export const EarnPage: FC = () => {
  const { user } = useSelector<StateInterface, AppReducer>(
    (state) => state.appReducer,
  );

  return (
    <div id="earn-page">
      <div className="details-section">
        <div className="card-details">
          <div className="label">
            <img src={dailyProfitsImage} alt="Daily Offers" />
            <span>Daily Offers Completed</span>
          </div>
          <div className="answer">
            {intToString(user?.dailyOffersCompleted ?? 0x0)}{" "}
            <span className="colored">Offers</span>
          </div>
        </div>
        <div className="card-details">
          <div className="label">
            <img src={lastBalanceImage} alt="Daily Offers" />
            <span>Your Last Hydrex Balance</span>
          </div>
          <div className="answer">
            {intToString(parseFloat(user?.last_balance ?? "0"))}{" "}
            <img className="coin" src={coinImage} alt="Hydrex Point" />
          </div>
        </div>
      </div>
      <div className="title-earn-page">
        <div className="line"></div>
        <span>Offer walls</span>
      </div>
      <div className="description">
        Each Offer Wall contains hundreds of tasks to complete. Choose from one
        of them to start earning coins. (1000 Coins equals $1.00)
      </div>
      <div className="cards-content">
        <Swiper
          slidesPerView="auto"
          spaceBetween={0}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div
              className="card"
              style={{ backgroundImage: `url(${adgateImage})` }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="card"
              style={{ backgroundImage: `url(${monlixImage})` }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="card"
              style={{ backgroundImage: `url(${adgemImage})` }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card"></div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};
