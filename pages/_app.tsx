import Navbar from '../components/modules/navbar';
import '../styles/globals.css';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useState, useReducer } from 'react';
import { regularFetch } from '../components/utils/api';
import { TimeFramestate } from '../components/types/types';
import useLocalStorageState from '../components/hooks/useLocalStorageState';
import { dataToGetSwitch } from '../components/utils/dateTimeHelpers';
import { totalsData } from '../components/constants/placeholders';
import Footer from '../components/modules/footer';
import React from 'react';
import {
  getUserData,
  userDataInitialState,
  userSettingsReducer,
} from '../components/services/data/getUserData';
import {
  getTableDataPerformanceDataTotalsReducer,
  getTableDataPerformanceDataTotalsInitialState,
  getTableDataPerformanceTotals,
} from '../components/services/data/GetTableDataPerformance/totals';

const { darkAlgorithm, defaultAlgorithm } = antdTheme;

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

type ThemeType = 'light' | 'dark' | 'system';

const getTheme = (themeType: ThemeType) => {
  switch (themeType) {
    case 'light':
      return defaultAlgorithm;
    case 'dark':
      return darkAlgorithm;
    default:
      return defaultAlgorithm;
  }
};

const getClassName = (themeType: ThemeType) => {
  switch (themeType) {
    case 'light':
      return 'bg-white';
    case 'dark':
      return 'bg-neutral-900 dark';
    default:
      return 'bg-white';
  }
};

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
  const [userSettings, userSettingsDispatch] = useReducer(
    userSettingsReducer,
    userDataInitialState({})
  );
  const [timeFrame, setTimeFrame] = useLocalStorageState('timeFrame', 'max');
  const timeFrameState: TimeFramestate = { timeFrame, setTimeFrame };
  const timeFrameDates = dataToGetSwitch(timeFrame);
  const [totalPerformanceData, totalPerformanceDataDispatch] = useReducer(
    getTableDataPerformanceDataTotalsReducer,
    getTableDataPerformanceDataTotalsInitialState({
      isLoading: true,
    })
  );
  const [systemTheme, setSystemTheme] = useState<ThemeType>('light');

  useEffect(() => {
    getUserInfo(setUserInfo);
    getAccountSettings(userSettingsDispatch);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const listener = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
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

    getTableDataPerformanceTotals({
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
    <ConfigProvider
      theme={{
        algorithm:
          userSettings?.dark_mode === 'system'
            ? getTheme(systemTheme)
            : userSettings?.dark_mode === 'dark'
            ? darkAlgorithm
            : defaultAlgorithm,
      }}
    >
      <div
        className={`min-h-screen flex flex-col ${
          userSettings.dark_mode === 'system'
            ? getClassName(systemTheme)
            : userSettings?.dark_mode === 'dark'
            ? 'dark bg-neutral-900'
            : 'bg-white'
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
  );
}

export default MyApp;
