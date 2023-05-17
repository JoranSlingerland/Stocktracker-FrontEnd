import Navbar from '../components/modules/navbar';
import '../styles/globals.css';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useState, useReducer } from 'react';
import {
  regularFetch,
  apiRequestReducer,
  initialState,
} from '../components/utils/api';
import {
  userSettingsDispatch_Type,
  TimeFramestate,
} from '../components/types/types';
import useLocalStorageState from '../components/hooks/useLocalStorageState';
import { dataToGetSwitch } from '../components/utils/dateTimeHelpers';
import { totalsData } from '../components/constants/placeholders';
import {
  getUserData,
  getTableDataPerformance,
} from '../components/services/data';
import Footer from '../components/modules/footer';
import React from 'react';

const { darkAlgorithm, defaultAlgorithm } = antdTheme;

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
      };
    case 'setBrandfetchApiKey':
      return { ...state, brandfetch_api_key: action.payload };
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

async function getAccountSettings(userSettingsDispatch: any) {
  getUserData({}).then(({ response }) => {
    userSettingsDispatch({ type: 'setAll', payload: response });
  });
}

async function getUserInfo(setUserInfo: any) {
  await regularFetch({ url: '/.auth/me' }).then(({ response }) => {
    setUserInfo(response);
  });
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
    set_brandfetch_api_key: '',
    alpha_vantage_api_key: '',
    currency: '',
    isLoading: true,
  });
  const [timeFrame, setTimeFrame] = useLocalStorageState('timeFrame', 'max');
  const timeFrameState: TimeFramestate = { timeFrame, setTimeFrame };
  const timeFrameDates = dataToGetSwitch(timeFrame);
  const [totalPerformanceData, totalPerformanceDataDispatch] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: [totalsData] })
  );

  useEffect(() => {
    getUserInfo(setUserInfo);
    getAccountSettings(userSettingsDispatch);
  }, []);

  useEffect(() => {
    const body: any = {
      containerName: 'totals',
    };

    if (
      timeFrameDates.end_date === 'max' &&
      timeFrameDates.start_date === 'max'
    ) {
      body.allData = true;
    } else if (timeFrameDates.end_date && timeFrameDates.start_date) {
      body.startDate = timeFrameDates.start_date;
      body.endDate = timeFrameDates.end_date;
    } else {
      return;
    }

    const abortController = new AbortController();

    getTableDataPerformance({
      dispatcher: totalPerformanceDataDispatch,
      body,
      abortController,
      fallback_data: [totalsData],
    });

    return () => {
      abortController.abort();
    };
  }, [timeFrameDates.end_date, timeFrameDates.start_date]);

  const props = {
    userInfo,
    userSettingsDispatch,
    userSettings,
    timeFrameState,
    timeFrameDates,
    totalPerformanceData,
  };

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: userSettings.dark_mode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <div
          className={`min-h-screen flex flex-col ${
            userSettings.dark_mode ? 'dark bg-neutral-900' : 'bg-white'
          }`}
        >
          <Navbar {...props} />
          <div className="flex justify-center px-2 xl:px-0">
            <div className="w-full max-w-7xl">
              <Component {...pageProps} {...props} />
            </div>
          </div>
          <Footer />
        </div>
      </ConfigProvider>
    </>
  );
}

export default MyApp;
