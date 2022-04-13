import Navbar from '../components/navbar';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../services/msal';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <MsalProvider instance={msalInstance}>
        <Component {...pageProps} />
      </MsalProvider>
    </>
  );
}

export default MyApp;
