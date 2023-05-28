import { regularFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface UseUserInfo {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
}

interface UseUserInfoData {
  data: UseUserInfo;
  isLoading: boolean;
  isError: boolean;
  refetchData: (params?: { cacheOnly?: boolean }) => void;
  overwriteData: (data: UseUserInfo) => void;
}

async function getUserInfo() {
  const response = await regularFetch({
    url: '/.auth/me',
    method: 'GET',
    fallback_data: {
      clientPrincipal: {
        userId: '',
        userRoles: ['anonymous'],
        claims: [],
        identityProvider: '',
        userDetails: '',
      },
    },
  });
  return response;
}

function useUserInfo({ enabled = true }: { enabled?: boolean } = {}) {
  const fetchResult = useFetch<undefined, undefined, UseUserInfo>({
    fetchData: getUserInfo,
    enabled,
    initialData: {
      clientPrincipal: {
        userId: '',
        userRoles: ['anonymous'],
        claims: [],
        identityProvider: '',
        userDetails: '',
      },
    },
  });
  return fetchResult as UseUserInfoData;
}

export { useUserInfo };
