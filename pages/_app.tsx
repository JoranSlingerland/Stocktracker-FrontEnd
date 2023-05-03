import Navbar from '../components/navbar';
import '../styles/globals.css';
import { ConfigProvider, theme } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { regularFetch, cachedFetch } from '../utils/api-utils';

const { darkAlgorithm, defaultAlgorithm } = theme;

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
  const [userSettings, setUserSettings] = useState({
    id: '',
    dark_mode: false,
    clearbit_api_key: '',
    alpha_vantage_api_key: '',
    currency: '',
  });

  async function getUserInfo() {
    await regularFetch('/.auth/me', undefined).then((data) => {
      setUserInfo(data);
    });
  }

  async function getAccountSettings(userInfo: any) {
    await cachedFetch('/api/data/get_user_data', {}, 'POST', {
      userId: userInfo,
    }).then((data: any) => {
      setUserSettings(data);
    });
  }

  function setDarkModeCallback(darkMode: boolean) {
    setUserSettings({ ...userSettings, dark_mode: darkMode });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.clientPrincipal?.userId) {
      getAccountSettings(userInfo.clientPrincipal.userId);
    }
  }, [userInfo]);

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
                setDarkModeCallback={setDarkModeCallback}
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
