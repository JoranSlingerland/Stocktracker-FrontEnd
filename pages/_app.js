// pages/_app.js

import Navbar from '../components/navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen px-2 xl:px-0">
        <div className="w-full max-w-7xl">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
