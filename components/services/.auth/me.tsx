import { regularFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface UserInfo {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
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
  return response as { response: UserInfo; error: boolean };
}

function useUserInfo({ enabled = true }: { enabled?: boolean } = {}) {
  const fetchResult = useFetch<undefined, undefined, UserInfo>({
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
  return fetchResult;
}

export { useUserInfo };
