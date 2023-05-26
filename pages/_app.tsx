import Navbar from '../components/modules/navbar';
import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useState, useReducer, useMemo } from 'react';
import { regularFetch } from '../components/utils/api';
import { TimeFramestate } from '../components/types/types';
import useLocalStorageState from '../components/hooks/useLocalStorageState';
import { dataToGetSwitch } from '../components/utils/dateTimeHelpers';
import Footer from '../components/modules/footer';
import React from 'react';
import {
  getUserData,
  userDataInitialState,
  userSettingsReducer,
} from '../components/services/data/getUserData';
import { useTableDataPerformanceTotals } from '../components/services/data/GetTableDataPerformance/totals';
import useTheme from '../components/hooks/useTheme';

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
  const [userSettings, userSettingsDispatch] = useReducer(
    userSettingsReducer,
    userDataInitialState({
      isLoading: true,
    })
  );
  const [timeFrame, setTimeFrame] = useLocalStorageState('timeFrame', 'max');
  const timeFrameState: TimeFramestate = { timeFrame, setTimeFrame };
  const timeFrameDates = dataToGetSwitch(timeFrame);
  const timeFrameBody = useMemo(() => {
    const body: any = {};
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
    return body;
  }, [timeFrameDates.end_date, timeFrameDates.start_date]);
  const totalPerformance = useTableDataPerformanceTotals({
    body: {
      ...timeFrameBody,
      containerName: 'totals',
    },
  });
  const { algorithmTheme, className } = useTheme({
    dark_mode: userSettings.dark_mode,
  });

  useEffect(() => {
    getUserInfo(setUserInfo);
    getAccountSettings(userSettingsDispatch);
  }, []);

  const props = {
    userInfo,
    userSettingsDispatch,
    userSettings,
    timeFrameState,
    timeFrameDates,
    totalPerformance,
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithmTheme,

        components: {
          List: {
            paddingContentHorizontalLG: 0,
          },
          Form: {
            marginLG: 8,
          },
        },
      }}
    >
      <div className={`min-h-screen flex flex-col ${className}`}>
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
