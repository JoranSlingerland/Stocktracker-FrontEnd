import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

type UserSettings = {
  dark_mode: 'dark' | 'light' | 'system';
  clearbit_api_key: string;
  alpha_vantage_api_key: string;
  currency: string;
  brandfetch_api_key: string;
};

interface UseUserData {
  data: UserSettings;
  isLoading: boolean;
  isError: boolean;
  refetchData: (params?: { cacheOnly?: boolean }) => void;
  overwriteData: (data: UserSettings) => void;
}

async function getUserData({ overwrite }: { overwrite?: boolean }) {
  const response = await cachedFetch({
    url: `/api/data/get_user_data`,
    method: 'POST',
    fallback_data: {
      dark_mode: 'system',
      clearbit_api_key: '',
      alpha_vantage_api_key: '',
      currency: '',
      brandfetch_api_key: '',
    },
    overwrite,
  });
  return response;
}

function useUserData({
  enabled = true,
}: { enabled?: boolean } = {}): UseUserData {
  const fetchResult = useFetch<undefined, UserSettings>({
    body: undefined,
    fetchData: getUserData,
    enabled,
    initialData: {
      dark_mode: 'system',
      clearbit_api_key: '',
      alpha_vantage_api_key: '',
      currency: '',
      brandfetch_api_key: '',
    },
  });

  return fetchResult as UseUserData;
}

export { useUserData };

export type { UserSettings, UseUserData };
