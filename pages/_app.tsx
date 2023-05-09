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
import getUserData from '../components/services/data/getUserData';
import getTableDataPerformance from '../components/services/data/getTableDataPerformance';

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
  const [timeFrame, setTimeFrame] = useLocalStorageState('timeFrame', 'max');
  const timeFrameState: TimeFramestate = { timeFrame, setTimeFrame };
  const [timeFrameDates, setTimeFrameDates] = useState(
    dataToGetSwitch(timeFrame)
  );
  const [totalPerformanceData, totalPerformanceDataDispatch] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: [totalsData] })
  );

  async function getUserInfo() {
    await regularFetch({ url: '/.auth/me' }).then(({ response }) => {
      setUserInfo(response);
    });
  }

  async function getAccountSettings(userInfo: string) {
    getUserData({ body: { userId: userInfo } }).then(({ response }) => {
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

  useEffect(() => {
    setTimeFrameDates(dataToGetSwitch(timeFrame));
  }, [timeFrame]);

  useEffect(() => {
    if (!userInfo?.clientPrincipal?.userId) {
      return;
    }

    const { start_date, end_date } = timeFrameDates;
    const body: any = {
      userId: userInfo.clientPrincipal.userId,
      containerName: 'totals',
    };

    if (end_date === 'max' && start_date === 'max') {
      body.allData = true;
    } else if (end_date && start_date) {
      body.startDate = start_date;
      body.endDate = end_date;
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
  }, [userInfo, timeFrameDates]);

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
          className={`min-h-screen ${
            userSettings.dark_mode ? 'dark bg-neutral-900' : 'bg-white'
          }`}
        >
          <Navbar {...props} />
          <div className="flex justify-center px-2 xl:px-0">
            <div className="w-full max-w-7xl">
              <Component {...pageProps} {...props} />
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}

export default MyApp;
