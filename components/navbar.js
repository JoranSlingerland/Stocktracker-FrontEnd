// components\navbar.js

import {
  AreaChartOutlined,
  HomeOutlined,
  InteractionOutlined,
  LogoutOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiWithMessage, regularFetch } from '../utils/api-utils';

export default function App() {
  const [userInfo, setUserInfo] = useState();
  const [current, setCurrent] = useState('portfolio');

  useEffect(() => {
    setCurrent(window.location.pathname);
    getUserInfo();
  }, []);

  async function getUserInfo() {
    await regularFetch('/.auth/me', undefined).then((data) => {
      setUserInfo(data);
    });
  }

  const items = [
    {
      key: '/authenticated/portfolio/',
      icon: <HomeOutlined />,
      label: (
        <span>
          <a className="" href="/authenticated/portfolio/"></a>
          <p className="hidden sm:inline-block">Portfolio</p>
        </span>
      ),
    },
    {
      key: '/authenticated/performance/',
      icon: <AreaChartOutlined />,
      label: (
        <span>
          <a href="/authenticated/performance/?tab=1&date=max"></a>
          <p className="hidden sm:inline-block">Performance</p>
        </span>
      ),
    },
    {
      key: '/authenticated/actions/',
      icon: <InteractionOutlined />,
      label: (
        <span>
          <a href="/authenticated/actions/"></a>
          <p className="hidden sm:inline-block">Actions</p>
        </span>
      ),
    },
    {
      key: 'SubMenu',
      icon: <UserOutlined />,
      label: (
        <p className="hidden sm:inline-block">
          {userInfo && userInfo.clientPrincipal.userDetails}
        </p>
      ),
      className: 'float-right hidden sm:inline-block',
      disabled: !userInfo,
      children: [
        {
          key: 'quick_refresh',
          icon: <ReloadOutlined />,
          label: (
            <Tooltip title="Will refresh the last 7 days">
              <a
                onClick={() =>
                  ApiWithMessage(
                    `/api/orchestrators/start`,
                    'Calling Orchestrator',
                    'Orchestration called, This will take a bit',
                    'POST',
                    {
                      userId: userInfo.clientPrincipal.userId,
                      functionName: 'stocktracker_orchestrator',
                      daysToUpdate: 7,
                    },
                    'multipart/form-data'
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
