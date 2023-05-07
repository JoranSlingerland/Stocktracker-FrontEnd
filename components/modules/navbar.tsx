import {
  AreaChartOutlined,
  HomeOutlined,
  InteractionOutlined,
  LogoutOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Menu,
  Tooltip,
  Typography,
  Divider,
  Select,
  Statistic,
  Tabs,
  Skeleton,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ApiWithMessage } from '../utils/api';
import { UserInfo_Type, TimeFramestate } from '../types/types';
import type { MenuProps } from 'antd/es/menu';
import {
  formatCurrency,
  formatPercentageWithColors,
} from '../utils/formatting';

type MenuItem = Required<MenuProps>['items'][number];

const { Text } = Typography;

const loading = false;

export default function App({
  userInfo,
  timeFrameState,
}: {
  userInfo: UserInfo_Type;
  timeFrameState: TimeFramestate;
}) {
  const [current, setCurrent] = useState('portfolio');
  const { timeFrame, setTimeFrame } = timeFrameState;
  const timeFrameMap = {
    max: 'Max',
    year: 'Year',
    month: 'Month',
    week: 'Week',
    ytd: 'YTD',
  };

  useEffect(() => {
    setCurrent(window.location.pathname);
  }, []);

  const authenticated = () => {
    return (
      userInfo?.clientPrincipal?.userRoles.includes('authenticated') || false
    );
  };

  function overViewBarRow(
    text: string,
    value: number,
    percentage: number,
    loading: boolean
  ) {
    return (
      <div className="flex flex-row">
        <div>
          <Text type={'secondary'}>{text}</Text>
          <Skeleton
            active={loading}
            paragraph={false}
            title={true}
            loading={loading}
            className="w-40"
          >
            <Statistic
              value={value}
              className="pt-1"
              valueStyle={{ fontSize: '24px' }}
              formatter={(value) => formatCurrency({ value, currency: 'EUR' })}
            />
          </Skeleton>
        </div>
        <Skeleton
          active={loading}
          paragraph={false}
          title={true}
          loading={loading}
          className="ml-auto mr-0 mt-auto mb-0 w-20"
        >
          <Statistic
            className="ml-auto mr-0 mt-auto mb-0"
            value={percentage}
            formatter={(value) =>
              formatPercentageWithColors({
                value,
                className: 'text-lg',
                addIcon: true,
              })
            }
            loading={loading}
          />
        </Skeleton>
      </div>
    );
  }

  function OverViewBar({ loading }: { loading: boolean }) {
    return (
      <div className="w-96 p-2 cursor-default">
        <div className="flex flex-row">
          <Text strong>Portfolio Value</Text>

          <Select
            showArrow={false}
            className="ml-auto mr-0"
            defaultValue={timeFrame}
            style={{ width: 80 }}
            options={[
              { value: 'max', label: 'Max' },
              { value: 'year', label: 'Year' },
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' },
              { value: 'ytd', label: 'YTD' },
            ]}
            onChange={(value) => {
              setTimeFrame(value);
            }}
          />
        </div>
        <Divider className="m-2" />
        <div>
          <Skeleton
            active={loading}
            paragraph={false}
            title={true}
            loading={loading}
            className="w-40"
          >
            <Statistic
              value={10000}
              formatter={(value) => formatCurrency({ value, currency: 'EUR' })}
            />
          </Skeleton>
        </div>
        <Tabs
          size="small"
          centered
          items={[
            {
              key: '1',
              label: 'Total',
              children: (
                <div>
                  {overViewBarRow('Value P/L', 10000, 0.175, loading)}
                  {overViewBarRow('Forex P/L', 10000, 0.175, loading)}
                  {overViewBarRow('Dividend', 10000, 0.175, loading)}
                  {overViewBarRow('Fees', 10000, 0.175, loading)}
                  <Divider className="m-2" />
                  {overViewBarRow('Total P/L', 10000, 0.175, loading)}
                </div>
              ),
            },
            {
              key: '2',
              label: 'Unrealized',
              children: (
                <div>
                  {overViewBarRow('Value P/L', 10000, 0.175, loading)}
                  {overViewBarRow('Forex P/L', 10000, 0.175, loading)}
                  <Divider className="m-2" />
                  {overViewBarRow('Total P/L', 10000, 0.175, loading)}
                </div>
              ),
            },
            {
              key: '3',
              label: 'Realized',
              children: (
                <div>
                  {overViewBarRow('Value P/L', 10000, 0.175, loading)}
                  {overViewBarRow('Forex P/L', 10000, 0.175, loading)}
                  {overViewBarRow('Dividend', 10000, 0.175, loading)}
                  {overViewBarRow('Fees', 10000, 0.175, loading)}
                  <Divider className="m-2" />
                  {overViewBarRow('Total P/L', 10000, 0.175, loading)}
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  }

  const items: MenuItem[] = [
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
          <a href="/authenticated/performance/"></a>
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

  if (authenticated()) {
    items.push({
      key: 'overviewBar',
      disabled: loading,
      label: (
        <div className="cursor-default">
          <Skeleton
            className="w-40 pt-4"
            active={loading}
            paragraph={false}
            loading={loading}
          >
            <Text>{formatCurrency({ value: 10000, currency: 'EUR' })} </Text>{' '}
            <Divider type="vertical" />
            <Text>
              {timeFrameMap[timeFrame]}{' '}
              {formatPercentageWithColors({ value: 0.175 })}{' '}
            </Text>
          </Skeleton>
        </div>
      ),
      className: 'float-right',
      children: [
        {
          key: 'overviewDropdown',
          label: <OverViewBar loading={false} />,
          style: {
            width: 'fit-content',
            height: 'fit-content',
            margin: 0,
            padding: 0,
          },
          disabled: true,
        },
      ],
    });
  }

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
