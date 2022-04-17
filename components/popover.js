import { Popover } from '@headlessui/react';
import link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function MyPopover() {
  const [open, setOpen] = useState(false);
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
    <Popover className="">
      <Popover.Button>
        <p>{userInfo && userInfo.userDetails}</p>
      </Popover.Button>

      <Popover.Panel className="absolute z-10">
        <div className="flex flex-col p-2 break-all bg-gray-100 rounded grow">
          <a href="/.auth/logout?post_logout_redirect_uri=/">logout</a>
          <a href="/authenticated/settings">Settings</a>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
