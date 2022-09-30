import { Action } from "..";

export interface WithDrawRecents {
  amount: number;
  timestamp: number;
  added: boolean;
}

export interface UserModelType {
  ws_key: string;
  pid: string;
  username: string;
  avatar: string;
  xp: number;
  total_xp: number;
  level: number;
  balance: string;
  discord_id: string;
  last_balance: string;
  admin: boolean;
  notifications: string[];
  referrer: {
    referredBy: string;
    invitesDone: string[];
    collected: number;
  };
  dailyOffersCompleted: number;
  discord_affiliate_done: number;
  lastOfferCompleted: number;
  verified: boolean;
  email: string;
  createdAt: string;
  banned: boolean;
  discord?: {
    id: string;
    avatar: string;
    banner: string;
    discriminator: string;
    username: string;
    banner_color: string;
    collected: number;
  } | null;
  withdraw_recents: WithDrawRecents[];
}

export interface Transaction {
  avatar: string;
  username: string;
  method: string;
  amount: number;
}

export interface Configs {
  perOneDollar: number;
  fee: number;
  version_text: string;
  cash_allowed: {
    [reward: string]: {
      allowed: boolean;
      cards?: number[];
      perOneDollar?: number;
      perOneRobux?: number;
    };
  };
  gift_cards: {
    [key: string]: {
      color: string;
      image: string;
      allowed: boolean;
    };
  };
}
export interface AppReducer {
  settings_content: {
    enabled: boolean;
    content_type: number;
  };
  checkout_content: {
    type_content: number;
    fee?: number;
    amount?: number;
    priceBTC?: number;
    target_user?: string;
  };
  transactions?: Transaction[];
  dropDown: boolean;
  next_payout_time_left?: number;
  joined_discord_server: boolean;
  error_page_content?: {
    title: string;
    msg: string;
  };
  user: UserModelType | null;
  container_dash: number;
  alert_verify: {
    type: boolean;
    msg: string | null;
  };
  submit_button_verify: boolean;
  wrap_alert_verify: {
    code: string | null;
  };
  offers?: {
    walls: {
      [name: string]: {
        image: string;
      };
    };
  };
  configs?: Configs;
}

export const appReducer = (
  state: AppReducer = {
    settings_content: {
      enabled: false,
      content_type: 0x1,
    },
    checkout_content: {
      type_content: 0x0,
    },
    dropDown: false,
    user: null,
    container_dash: 0x0,
    submit_button_verify: false,
    alert_verify: {
      type: false,
      msg: null,
    },
    joined_discord_server: false,
    wrap_alert_verify: {
      code: null,
    },
  },
  action: Action<AppReducer & { target?: string; btc_price?: number }>,
): AppReducer => {
  switch (action.type) {
    case "UPDATE_APP_STATE":
      return Object.assign({}, state, action.payload);
    case "UPDATE_CHECKOUT_STATE":
      return Object.assign({}, state, {
        checkout_content: Object.assign(
          state.checkout_content,
          action.payload.btc_price
            ? {
                priceBTC: action.payload.btc_price,
              }
            : {},
          action.payload.target
            ? {
                target_user: action.payload.target,
              }
            : {},
        ),
      });
    default:
      return state;
  }
};
