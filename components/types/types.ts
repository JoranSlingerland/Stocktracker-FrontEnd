interface UserInfo_Type {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
}

interface UserSettings_Type {
  id: string;
  dark_mode: boolean;
  clearbit_api_key: string;
  alpha_vantage_api_key: string;
  brandfetch_api_key: string;
  currency: string;
  isLoading: boolean;
}

interface userSettingsDispatch_Type {
  type:
    | 'setDarkMode'
    | 'setClearbitApiKey'
    | 'setAlphaVantageApiKey'
    | 'setBrandfetchApiKey'
    | 'setCurrency'
    | 'setAll'
    | 'setLoading';
  payload:
    | string
    | boolean
    | {
        dark_mode: boolean;
        clearbit_api_key: string;
        brandfetch_api_key: string;
        alpha_vantage_api_key: string;
        currency: string;
      };
}

interface TimeFramestate {
  timeFrame: 'max' | 'year' | 'month' | 'week' | 'ytd';
  setTimeFrame: React.Dispatch<
    React.SetStateAction<'max' | 'year' | 'month' | 'week' | 'ytd'>
  >;
}

export type {
  UserInfo_Type,
  UserSettings_Type,
  userSettingsDispatch_Type,
  TimeFramestate,
};
