import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { Dispatch, StateInterface } from "../../redux";
import { AppReducer } from "../../redux/reducers/app.reducer";
import { EarnPage } from "./container/earnPage.dash";
import { StatusEarnPage } from "./container/statusEarn.dash";
import { SideBarDashboard } from "./Sidebar";
import { TransactionsSection } from "./transactions";
import { ReferralPage } from "./container/referral.dash";
import { getValueOfQuery } from "../../utils/parseQueries";
import { CashOutPage } from "./container/cashout.dash";
import { CheckOutPage } from "./container/checkout.dash";
import { AccountSettings } from "./accountSettings";

export const DashboardContent: FC = () => {
  const dispatch = useDispatch<Dispatch<AppReducer>>();
  const { dropDown, container_dash, checkout_content, settings_content } =
    useSelector<StateInterface, AppReducer>((state) => state.appReducer);

  useEffect(() => {
    let errorMessage = getValueOfQuery("error_msg", document.URL);
    let queriesRemoved = document.URL.replace(/\?.*/, "");
    if (errorMessage) {
      toast.error(errorMessage);
      if (location.href !== queriesRemoved) {
        location.href = queriesRemoved;
        return;
      }
    }
  }, []);

  const UnDropDownContent = (event: any) => {
    if (dropDown && !event.target.matches(".slide-down *")) {
      dispatch({
        type: "UPDATE_APP_STATE",
        payload: {
          dropDown: false,
        },
      });
    }
  };

  return (
    <div id="dashboard-content" onClick={UnDropDownContent}>
      <Toaster position="bottom-right" reverseOrder={false} />

      {settings_content.enabled ? <AccountSettings /> : null}

      <SideBarDashboard />
      <div id="container-dashboard">
        <TransactionsSection />

        <div className="content-containet-dashboard">
          {container_dash === 0x0 ? <EarnPage /> : null};
          {container_dash === 0x1 ? <StatusEarnPage /> : null};
          {container_dash === 0x2 ? <ReferralPage /> : null};
          {container_dash === 0x3 ? <CashOutPage /> : null};
          {checkout_content.type_content !== 0x0 ? <CheckOutPage /> : null};
        </div>
      </div>
    </div>
  );
};
