import { Menu } from 'antd';
import {
  AreaChartOutlined,
  HomeOutlined,
  InteractionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

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

  return (
    <Menu mode="horizontal">
      <Menu.Item key="portfolio" icon={<HomeOutlined />}>
        <a href="/authenticated/portfolio/">Portfolio</a>
      </Menu.Item>
      <Menu.Item key="performance" icon={<AreaChartOutlined />}>
        <a href="/authenticated/performance/">Performance</a>
      </Menu.Item>
      <Menu.Item key="actions" icon={<InteractionOutlined />}>
        <a href="/authenticated/actions/">Actions</a>
      </Menu.Item>
      {userInfo && (
        <SubMenu
          icon={<UserOutlined />}
          className="ml-auto"
          key="SubMenu"
          title={userInfo && userInfo.userDetails}
        >
          <Menu.Item key="logout">
            <a href="/.auth/logout?post_logout_redirect_uri=/">Logout</a>
          </Menu.Item>
          <Menu.Item key="settings">
            <a href="/authenticated/settings">Settings</a>
          </Menu.Item>
        </SubMenu>
      )}
    </Menu>
  );
}
