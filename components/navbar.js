import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Popover } from '@headlessui/react';

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

function MyPopover() {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);

  return (
    <Popover className="">
      <Popover.Button>
        <p>{userInfo && userInfo.userDetails}</p>
      </Popover.Button>

      <Popover.Panel className="absolute z-10">
        <div className="flex flex-col p-2 break-all bg-gray-100 rounded grow">
          <Link href="/.auth/logout?post_logout_redirect_uri=/">logout</Link>
          <Link href="/authenticated/settings">Settings</Link>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

export default function header() {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);

  return (
    <div>
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
          <MyPopover />
        </div>
      </nav>
      {/* left */}
    </div>
  );
}
