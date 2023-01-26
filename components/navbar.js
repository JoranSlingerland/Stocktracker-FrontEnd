// components\navbar.js

import { Menu, Tooltip } from 'antd';
import {
  AreaChartOutlined,
  HomeOutlined,
  InteractionOutlined,
  UserOutlined,
  ReloadOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiWithMessage } from '../utils/api-utils';

export default function App() {
  const [userInfo, setUserInfo] = useState();
  const [current, setCurrent] = useState('portfolio');
  useEffect(() => {
    setCurrent(window.location.pathname);
  });
  console.log(current);
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

  async function handleClick(url, runningMessage, successMessage) {
    ApiWithMessage(url, runningMessage, successMessage);
  }
  const items = [
    {
      key: '/authenticated/portfolio/',
      icon: <HomeOutlined />,
      label: <a href="/authenticated/portfolio/">Portfolio</a>,
    },
    {
      key: '/authenticated/performance/',
      icon: <AreaChartOutlined />,
      label: (
        <Link
          href={{
            pathname: '/authenticated/performance/',
            query: { tab: '1', date: 'max' },
          }}
        >
          Performance
        </Link>
      ),
    },
    {
      key: '/authenticated/actions/',
      icon: <InteractionOutlined />,
      label: <a href="/authenticated/actions/">Actions</a>,
    },
    {
      key: 'SubMenu',
      icon: <UserOutlined />,
      label: userInfo && userInfo.userDetails,
      className: 'float-right',
      disabled: !userInfo,
      children: [
        {
          key: 'quick_refresh',
          icon: <ReloadOutlined />,
          label: (
            <Tooltip title="Will refresh the last 7 days">
              <a
                onClick={() =>
                  handleClick(
                    `/api/orchestrators/stocktracker_orchestrator/7`,
                    'Calling Orchestrator',
                    'Orchestration called, This will take a bit'
                  )
                }
              >
                Quick refresh
              </a>
            </Tooltip>
          ),
        },
        {
          key: '/authenticated/settings/',
          icon: <SettingOutlined />,
          label: <a href="/authenticated/settings">Settings</a>,
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: (
            <a
              href="/.auth/logout?post_logout_redirect_uri=/"
              onClick={() => {
                localStorage.clear();
              }}
            >
              Logout
            </a>
          ),
        },
      ],
    },
  ];

  return (
    <div>
      <Menu
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        className="block"
      />
    </div>
  );
}
