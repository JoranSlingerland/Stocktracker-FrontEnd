import { useContext, createContext } from 'react';
import { UseUserData } from '../services/user/get';
import { UseFetchResult } from './useFetch';

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

export const useProps = () => {
  return useContext(PropsContext);
};
