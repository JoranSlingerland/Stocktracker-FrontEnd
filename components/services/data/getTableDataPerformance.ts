import { cachedFetch } from '../../utils/api';
import { apiRequestReducer } from '../../utils/api';
import { totalsData, stocksHeldData } from '../../constants/placeholders';

// Shared
interface SharedBody {
  allData: boolean;
  startDate?: string;
  endDate?: string;
}

// Totals
interface GetTableDataPerformanceBodyTotals extends SharedBody {
  dataType: 'totals';
}

interface GetTableDataPerformanceDataTotals {
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

type GetTableDataPerformanceDataAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: GetTableDataPerformanceDataTotals[] }
  | { type: 'FETCH_FAILURE'; payload?: GetTableDataPerformanceDataTotals[] }
  | { type: 'FETCH_ABORT' };

const getTableDataPerformanceDataTotalsInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}) => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [totalsData],
});

const getTableDataPerformanceDataTotalsReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: GetTableDataPerformanceDataTotals[];
  },
  action: GetTableDataPerformanceDataAction
): {
  isLoading: boolean;
  isError: boolean;
  data: GetTableDataPerformanceDataTotals[];
} => {
  return apiRequestReducer(state, action);
};

function getTableDataPerformanceTotals({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: React.Dispatch<GetTableDataPerformanceDataAction>;
  abortController: AbortController;
  body: GetTableDataPerformanceBodyTotals;
  fallback_data?: GetTableDataPerformanceDataTotals[];
}) {
  cachedFetch({
    url: `/api/data/get_table_data_performance`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}

export {
  getTableDataPerformanceTotals,
  getTableDataPerformanceDataTotalsReducer,
  getTableDataPerformanceDataTotalsInitialState,
};

export type { GetTableDataPerformanceDataTotals };

// Stocks Held
interface GetTableDataPerformanceBodyStocksHeld extends SharedBody {
  dataType: 'stocks_held';
}

interface GetTableDataPerformanceDataStocksHeld {
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
  id: string;
  meta: {
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
  };
}

type GetTableDataPerformanceDataStocksHeldAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: GetTableDataPerformanceDataStocksHeld[] }
  | { type: 'FETCH_FAILURE'; payload?: GetTableDataPerformanceDataStocksHeld[] }
  | { type: 'FETCH_ABORT' };

const getTableDataPerformanceDataStocksHeldInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}) => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [stocksHeldData],
});

const getTableDataPerformanceDataStocksHeldReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: GetTableDataPerformanceDataStocksHeld[];
  },
  action: GetTableDataPerformanceDataStocksHeldAction
): {
  isLoading: boolean;
  isError: boolean;
  data: GetTableDataPerformanceDataStocksHeld[];
} => {
  return apiRequestReducer(state, action);
};

function getTableDataPerformanceStocksHeld({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: React.Dispatch<GetTableDataPerformanceDataStocksHeldAction>;
  abortController: AbortController;
  body: GetTableDataPerformanceBodyStocksHeld;
  fallback_data?: GetTableDataPerformanceDataStocksHeld[];
}) {
  cachedFetch({
    url: `/api/data/get_table_data_performance`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}

export {
  getTableDataPerformanceStocksHeld,
  getTableDataPerformanceDataStocksHeldReducer,
  getTableDataPerformanceDataStocksHeldInitialState,
};

export type { GetTableDataPerformanceDataStocksHeld };
