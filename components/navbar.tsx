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
import { ApiWithMessage } from '../utils/api-utils';
import { UserInfo_Type } from '../utils/types';

export default function App({ userInfo }: { userInfo: UserInfo_Type }) {
  const [current, setCurrent] = useState('portfolio');
  useEffect(() => {
    setCurrent(window.location.pathname);
  }, []);

  const authenticated = () => {
    return (
      userInfo?.clientPrincipal?.userRoles.includes('authenticated') || false
    );
  };

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
          {userInfo?.clientPrincipal?.userDetails || ''}
        </p>
      ),
      className: 'float-right hidden sm:inline-block',
      disabled: !authenticated(),
      children: [
        {
          key: 'quick_refresh',
          icon: <ReloadOutlined />,
          label: (
            <Tooltip title="Will refresh the last 7 days">
              <a
                onClick={() =>
                  ApiWithMessage(
                    `/api/orchestrator/start`,
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
