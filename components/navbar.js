import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import PopOver from './popover';

export default function header() {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);

  async function getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }

  return (
    <div >
      <nav className="flex items-center h-10 px-5 bg-gray-100">
        {userInfo && (
          <div className="flex items-center w-3/12 space-x-2">
            <div>
              <Link href="/authenticated/portfolio">Portfolio</Link>
            </div>
            <div>
              <Link href="/authenticated/performance">Performance</Link>
            </div>
            <div>
              <Link href="/authenticated/actions">Actions</Link>
            </div>
          </div>
        )}
        {/* right */}
        <div className="flex justify-end w-9/12">
          <PopOver />
        </div>
      </nav>
      {/* left */}
    </div>
  );
}
