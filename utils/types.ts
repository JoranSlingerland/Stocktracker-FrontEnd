type UserInfo_Type = {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
};

type UserSettings_Type = {
  id: string;
  dark_mode: boolean;
  clearbit_api_key: string;
  alpha_vantage_api_key: string;
  currency: string;
  isLoading: boolean;
};

type userSettingsDispatch_Type = {
  type:
    | 'setDarkMode'
    | 'setClearbitApiKey'
    | 'setAlphaVantageApiKey'
    | 'setCurrency'
    | 'setAll'
    | 'setLoading';
  payload:
    | string
    | boolean
    | {
        dark_mode: boolean;
        clearbit_api_key: string;
        alpha_vantage_api_key: string;
        currency: string;
      };
};

export type { UserInfo_Type, UserSettings_Type, userSettingsDispatch_Type };
