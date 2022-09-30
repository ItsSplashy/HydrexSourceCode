import { StateInterface, store } from "../redux";
import { BinaryReader } from "./binary_packet";
import { toast } from "react-hot-toast";

export const clientPacketUtil = (event: MessageEvent<ArrayBuffer>) => {
  if (!(event.data instanceof ArrayBuffer)) return;
  const state: StateInterface = (window as any).state;
  const reader = new BinaryReader(new DataView(event.data), 0, true);

  let packedId: number = reader.getUint8();

  switch (packedId) {
    case 0x0:
      break;
    case 0x10: // Change Balance
      let new_balance: number = reader.getInt32();
      toast.success(`Your received ${new_balance}HP$`);
      store.dispatch({
        type: "UPDATE_APP_STATE",
        payload: {
          user: Object.assign({}, state.appReducer.user, {
            balance: String(
              parseFloat(state.appReducer.user?.balance ?? "0") + new_balance,
            ),
            last_balance: state.appReducer.user?.balance,
          }),
        },
      });
      break;
    case 0x11:
      let nextPayoutTime: number = parseInt(reader.getStringUTF8());
      store.dispatch({
        type: "UPDATE_APP_STATE",
        payload: {
          next_payout_time_left: nextPayoutTime,
        },
      });
      break;
    case 0x12: // Update User Joined to server
      let joined: number = reader.getUint8();
      store.dispatch({
        type: "UPDATE_APP_STATE",
        payload: {
          joined_discord_server: joined === 0x1,
        },
      });
  }
};
