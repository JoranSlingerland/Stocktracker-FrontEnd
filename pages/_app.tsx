import Navbar from '../components/navbar';
import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider theme={{}}>
        <div className="min-h-screen">
          <Navbar />
          <div className="flex justify-center px-2 xl:px-0">
            <div className="w-full max-w-7xl">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}

export default MyApp;
