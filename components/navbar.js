import { Menu } from 'antd';
import {
  AreaChartOutlined,
  HomeOutlined,
  InteractionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import UserInfo from './UserInfo';

const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    current: undefined,
  };

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        <Menu.Item key="portfolio" icon={<HomeOutlined />}>
          <a href="/authenticated/portfolio/">Portfolio</a>
        </Menu.Item>
        <Menu.Item key="performance" icon={<AreaChartOutlined />}>
          <a href="/authenticated/performance/">Performance</a>
        </Menu.Item>
        <Menu.Item key="actions" icon={<InteractionOutlined />}>
          <a href="/authenticated/actions/">Actions</a>
        </Menu.Item>
        <SubMenu
          icon={<UserOutlined />}
          className="ml-auto"
          key="SubMenu"
          title={<UserInfo />}
        >
          <Menu.Item key="logout">
            <a href="/.auth/logout?post_logout_redirect_uri=/">logout</a>
          </Menu.Item>
          <Menu.Item key="settings">
            <a href="/authenticated/settings">Settings</a>
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default App;
