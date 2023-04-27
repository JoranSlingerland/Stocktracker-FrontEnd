import Navbar from '../components/navbar';
import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { regularFetch } from '../utils/api-utils';

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

  async function getUserInfo() {
    await regularFetch('/.auth/me', undefined).then((data) => {
      setUserInfo(data);
    });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <ConfigProvider theme={{}}>
        <div className="min-h-screen">
          <Navbar userInfo={userInfo} />
          <div className="flex justify-center px-2 xl:px-0">
            <div className="w-full max-w-7xl">
              <Component {...pageProps} userInfo={userInfo} />
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}

export default MyApp;
