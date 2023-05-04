import Navbar from '../components/navbar';
import '../styles/globals.css';
import { ConfigProvider, theme } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useState, useReducer } from 'react';
import { regularFetch_2, cachedFetch_2 } from '../utils/api-utils';
import { userSettingsDispatch_Type } from '../utils/types';

const { darkAlgorithm, defaultAlgorithm } = theme;

const userSettingsReducer = (state: any, action: userSettingsDispatch_Type) => {
  switch (action.type) {
    case 'setDarkMode':
      return { ...state, dark_mode: action.payload };
    case 'setClearbitApiKey':
      return { ...state, clearbit_api_key: action.payload };
    case 'setAlphaVantageApiKey':
      return {
        ...state,
        alpha_vantage_api_key: action.payload,
        isLoading: false,
      };
    case 'setCurrency':
      return { ...state, currency: action.payload };
    case 'setAll':
      if (typeof action.payload === 'object') {
        return { ...state, ...action.payload };
      }
      throw new Error('Payload must be an object');
    case 'setLoading':
      return { ...state, isLoading: action.payload };
  }
};

function setDarkMode(dark_mode: boolean) {
  localStorage.setItem('dark_mode', JSON.stringify(dark_mode));
}

function getDarkMode(): boolean {
  const dark_mode = localStorage.getItem('dark_mode');
  if (dark_mode) {
    return JSON.parse(dark_mode);
  }
  return false;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [userInfo, setUserInfo] = useState({
    clientPrincipal: {
      userId: '',
      userRoles: ['anonymous'],
      claims: [],
      identityProvider: '',
      userDetails: '',
    },
  });
  const [userSettings, userSettingsDispatch] = useReducer(userSettingsReducer, {
    dark_mode: false,
    clearbit_api_key: '',
    alpha_vantage_api_key: '',
    currency: '',
    isLoading: true,
  });

  async function getUserInfo() {
    await regularFetch_2({ url: '/.auth/me' }).then(({ response }) => {
      setUserInfo(response);
    });
  }

  async function getAccountSettings(userInfo: any) {
    await cachedFetch_2({
      url: '/api/data/get_user_data',
      fallback_data: {},
      method: 'POST',
      body: {
        userId: userInfo,
      },
    }).then(({ response }) => {
      console.log('response', response);
      userSettingsDispatch({ type: 'setAll', payload: response });
    });
  }

  useEffect(() => {
    getUserInfo();
    userSettingsDispatch({ type: 'setDarkMode', payload: getDarkMode() });
  }, []);

  useEffect(() => {
    if (userInfo?.clientPrincipal?.userId) {
      getAccountSettings(userInfo.clientPrincipal.userId);
    }
  }, [userInfo]);

  useEffect(() => {
    setDarkMode(userSettings.dark_mode);
  }, [userSettings.dark_mode]);

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: userSettings.dark_mode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <div
          className={`min-h-screen ${
            userSettings.dark_mode ? 'dark bg-neutral-900' : 'bg-white'
          }`}
        >
          <Navbar userInfo={userInfo} />
          <div className="flex justify-center px-2 xl:px-0">
            <div className="w-full max-w-7xl">
              <Component
                {...pageProps}
                userInfo={userInfo}
                userSettingsDispatch={userSettingsDispatch}
                userSettings={userSettings}
              />
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}

export default MyApp;
