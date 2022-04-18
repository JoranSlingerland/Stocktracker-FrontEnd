// pages/_app.js

import React from 'react';
import Navbar from '../components/navbar';
import '../styles/globals.css';
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
