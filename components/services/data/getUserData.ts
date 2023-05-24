import { cachedFetch } from '../../utils/api';

type UserSettings = {
  dark_mode: 'dark' | 'light' | 'system';
  clearbit_api_key: string;
  alpha_vantage_api_key: string;
  currency: string;
  isLoading: boolean;
  brandfetch_api_key: string;
  isError: boolean;
};

const userDataInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}): UserSettings => ({
  dark_mode: 'system',
  clearbit_api_key: '',
  alpha_vantage_api_key: '',
  currency: '',
  isLoading: isLoading || false,
  brandfetch_api_key: '',
  isError: isError || false,
});

type userDataActions =
  | { type: 'setDarkMode'; payload: 'dark' | 'light' | 'system' }
  | { type: 'setClearbitApiKey'; payload: string }
  | { type: 'setAlphaVantageApiKey'; payload: string }
  | { type: 'setBrandfetchApiKey'; payload: string }
  | { type: 'setCurrency'; payload: string }
  | { type: 'setLoading'; payload: boolean }
  | {
      type: 'setAll';
      payload: {
        dark_mode: 'dark' | 'light' | 'system';
        clearbit_api_key: string;
        brandfetch_api_key: string;
        alpha_vantage_api_key: string;
        currency: string;
      };
    };

const userSettingsReducer = (state: UserSettings, action: userDataActions) => {
  switch (action.type) {
    case 'setDarkMode':
      return { ...state, dark_mode: action.payload };
    case 'setClearbitApiKey':
      return { ...state, clearbit_api_key: action.payload };
    case 'setAlphaVantageApiKey':
      return {
        ...state,
        alpha_vantage_api_key: action.payload,
      };
    case 'setBrandfetchApiKey':
      return { ...state, brandfetch_api_key: action.payload };
    case 'setCurrency':
      return { ...state, currency: action.payload };
    case 'setAll':
      if (typeof action.payload === 'object') {
        return { ...state, ...action.payload };
      }
      return state;
    case 'setLoading':
      return { ...state, isLoading: action.payload };
  }
};

async function getUserData({
  overwrite,
}: {
  overwrite?: boolean;
}): Promise<{ error: boolean; response: UserSettings }> {
  return await cachedFetch({
    url: `/api/data/get_user_data`,
    method: 'POST',
    fallback_data: {},
    overwrite,
  }).then((data) => {
    return data;
  });
}

export { getUserData, userDataInitialState, userSettingsReducer };

export type { UserSettings, userDataActions };
