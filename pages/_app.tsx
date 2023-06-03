import Navbar from '../components/modules/navbar';
import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { useMemo, createContext } from 'react';
import useSessionStorageState from '../components/hooks/useSessionStorageState';
import { dataToGetSwitch } from '../components/utils/dateTimeHelpers';
import Footer from '../components/modules/footer';
import React from 'react';
import { useUserData } from '../components/services/user/get';
import { useTableDataPerformanceTotals } from '../components/services/table/performance/totals';
import useTheme from '../components/hooks/useTheme';
import { useUserInfo } from '../components/services/.auth/me';
import { UseUserData } from '../components/services/user/get';
import { UseFetchResult } from '../components/hooks/useFetch';

interface Props {
  userInfo: UserInfo | undefined;
  userSettings: UseUserData | undefined;
  timeFrameState: TimeFramestate | undefined;
  timeFrameDates: { start_date: string; end_date: string };
  totalPerformance: UseFetchResult<TotalsData[]> | undefined;
}

export const PropsContext = createContext<Props>({
  userInfo: undefined,
  userSettings: undefined,
  timeFrameState: undefined,
  timeFrameDates: { start_date: 'max', end_date: 'max' },
  totalPerformance: undefined,
});

function MyApp({ Component, pageProps }: AppProps) {
  const { data: userInfo } = useUserInfo();
  const userSettings = useUserData();
  const [timeFrame, setTimeFrame] = useSessionStorageState<
    TimeFramestate['timeFrame']
  >('timeFrame', 'max');
  const timeFrameState: TimeFramestate = { timeFrame, setTimeFrame };
  const timeFrameDates = dataToGetSwitch(timeFrame);
  const timeFrameBody = useMemo(() => {
    const body: TimeFrameBody = {};
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
    query: {
      ...timeFrameBody,
      containerName: 'totals',
    },
  });
  const { algorithmTheme, className } = useTheme({
    dark_mode: userSettings.data?.dark_mode || 'system',
  });

  const props = {
    userInfo,
    userSettings,
    timeFrameState,
    timeFrameDates,
    totalPerformance,
  };

  return (
    <PropsContext.Provider value={props}>
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
          <Navbar />
          <div className="flex justify-center px-2 xl:px-0">
            <div className="w-full max-w-7xl">
              <Component {...pageProps} />
            </div>
          </div>
          <Footer />
        </div>
      </ConfigProvider>
    </PropsContext.Provider>
  );
}

export default MyApp;
