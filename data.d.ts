interface UserInfo {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
}

interface TimeFramestate {
  timeFrame: 'max' | 'year' | 'month' | 'week' | 'ytd';
  setTimeFrame: React.Dispatch<
    React.SetStateAction<'max' | 'year' | 'month' | 'week' | 'ytd'>
  >;
}

interface TimeFrameBody {
  endDate?: string;
  startDate?: string;
  allData?: boolean;
}

interface MetaData {
  symbol: string;
  name: string;
  description: string;
  country: string;
  sector: string;
  domain: string;
  links: {
    name: string;
    url: string;
  }[];
  logo: string;
  icon: string;
  symbol_img: string;
  banner: string;
}

interface TotalsData {
  date: string;
  total_invested: number;
  realized: {
    dividends: number;
    transaction_cost: number;
    value_pl: number;
    forex_pl: number;
    total_pl: number;
    dividends_percentage: number;
    transaction_cost_percentage: number;
    value_pl_percentage: number;
    forex_pl_percentage: number;
    total_pl_percentage: number;
  };
  unrealized: {
    total_cost: number;
    total_value: number;
    value_pl: number;
    forex_pl: number;
    total_pl: number;
    value_pl_percentage: number;
    forex_pl_percentage: number;
    total_pl_percentage: number;
  };
  combined: {
    value_pl: number;
    forex_pl: number;
    total_pl: number;
    value_pl_percentage: number;
    forex_pl_percentage: number;
    total_pl_percentage: number;
  };
  id: string;
}

interface StocksHeldData {
  date: string;
  symbol: string;
  currency: string;
  fully_realized: boolean;
  partial_realized: boolean;
  realized: {
    cost_per_share_buy: number;
    cost_per_share_buy_foreign: number;
    cost_per_share_sell: number;
    cost_per_share_sell_foreign: number;
    buy_price: number;
    buy_price_foreign: number;
    sell_price: number;
    sell_price_foreign: number;
    average_buy_fx_rate: number;
    average_sell_fx_rate: number;
    quantity: number;
    transaction_cost: number;
    dividend: number;
    total_dividends: number;
    value_pl: number;
    forex_pl: number;
    total_pl: number;
    value_pl_percentage: number;
    forex_pl_percentage: number;
    total_pl_percentage: number;
  };
  unrealized: {
    cost_per_share: number;
    cost_per_share_foreign: number;
    total_cost: number;
    total_cost_foreign: number;
    average_fx_rate: number;
    quantity: number;
    open_value: number;
    high_value: number;
    low_value: number;
    close_value: number;
    total_value: number;
    value_pl: number;
    forex_pl: number;
    total_pl: number;
    total_pl_percentage: number;
    value_pl_percentage: number;
    forex_pl_percentage: number;
  };
  combined: {
    value_pl: number;
    forex_pl: number;
    total_pl: number;
    value_pl_percentage: number;
    forex_pl_percentage: number;
    dividend_pl_percentage: number;
    transaction_cost_percentage: number;
    total_pl_percentage: number;
  };
  weight: number;
  id: string;
  meta: MetaData;
}

interface InputInvestedData {
  date: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
  id: string;
}

interface InputTransactionData {
  symbol: string;
  date: string;
  currency: string;
  cost_per_share: number;
  quantity: number;
  transaction_type: string;
  transaction_cost: number;
  domain: string;
  id: string;
  meta: MetaData;
  total_cost: number;
}

interface InputTransactionData {
  symbol: string;
  date: string;
  currency: string;
  cost_per_share: number;
  quantity: number;
  transaction_type: string;
  transaction_cost: number;
  domain: string;
  id: string;
  meta: MetaData;
  total_cost: number;
}
