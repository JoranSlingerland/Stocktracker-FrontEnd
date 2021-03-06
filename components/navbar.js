import { Menu, message, Tooltip } from 'antd';
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

const { SubMenu } = Menu;

export default function App() {
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

  async function callApi(url, runningMessage, successMessage) {
    const hide = message.loading(runningMessage, 10);
    const response = await fetch(url);
    try {
      const body = await response.json();
    } catch (error) {
      console.log('error', error);
    }
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 202
    ) {
      hide();
      message.success(successMessage);
    } else {
      hide();
      message.error('Something went wrong :(');
    }
  }

  async function handleClick(url, runningMessage, successMessage) {
    callApi(url, runningMessage, successMessage);
  }

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="portfolio" icon={<HomeOutlined />}>
          <a href="/authenticated/portfolio/">Portfolio</a>
        </Menu.Item>
        <Menu.Item key="performance" icon={<AreaChartOutlined />}>
          <Link
            href={{
              pathname: '/authenticated/performance/',
              query: { tab: '1', date: 'max' },
            }}
          >
            Performance
          </Link>
        </Menu.Item>
        <Menu.Item key="actions" icon={<InteractionOutlined />}>
          <a href="/authenticated/actions/">Actions</a>
        </Menu.Item>
        {userInfo && (
          <SubMenu
            icon={<UserOutlined />}
            key="SubMenu"
            title={userInfo && userInfo.userDetails}
            className="ml-auto"
          >
            <Menu.Item
              onClick={() =>
                handleClick(
                  `/api/orchestrators/stocktracker_orchestrator/7`,
                  'Calling Orchestrator',
                  'Orchestration called, This will take a bit'
                )
              }
              key="quick_refresh"
              icon={<ReloadOutlined />}
            >
              <Tooltip title="Will refresh the last 7 days">
                Quick Refresh
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              <a href="/authenticated/settings">Settings</a>
            </Menu.Item>

            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              <a href="/.auth/logout?post_logout_redirect_uri=/">Logout</a>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </div>
  );
}
