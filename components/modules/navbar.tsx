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
  Drawer,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { UserInfo_Type, TimeFramestate } from '../types/types';
import type { MenuProps } from 'antd/es/menu';
import {
  formatCurrency,
  formatPercentageWithColors,
} from '../utils/formatting';
import useLocalStorageState from '../hooks/useLocalStorageState';
import { startOrchestrator } from '../services/orchestrator/startOrchestrator';
import { MenuOutlined } from '@ant-design/icons';
import { TotalsData } from '../types/types';
import { UseFetchResult } from '../hooks/useFetch';
import { UseUserData } from '../services/data/getUserData';

type MenuItem = Required<MenuProps>['items'][number];

const { Text, Link } = Typography;

export default function App({
  userInfo,
  timeFrameState,
  userSettings,
  totalPerformance,
}: {
  userInfo: UserInfo_Type;
  timeFrameState: TimeFramestate;
  userSettings: UseUserData;
  totalPerformance: UseFetchResult<TotalsData[]>;
}) {
  // const setup
  const [current, setCurrent] = useState('portfolio');
  const { timeFrame, setTimeFrame } = timeFrameState;
  const [tab, setTab] = useLocalStorageState('navbarTab', '1');
  const timeFrameMap = {
    max: 'Max',
    year: 'Year',
    month: 'Month',
    week: 'Week',
    ytd: 'YTD',
  };
  const authenticated = () => {
    return (
      userInfo?.clientPrincipal?.userRoles.includes('authenticated') || false
    );
  };
  const [drawerVisible, setDrawerVisible] = useState(false);

  // useEffect
  useEffect(() => {
    setCurrent(window.location.pathname);
  }, []);

  // functions
  function overViewBarRow(
    text: string,
    value: number | undefined,
    percentage: number | undefined,
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
              formatter={(value) =>
                formatCurrency({ value, currency: userSettings.data.currency })
              }
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
              value={totalPerformance.data?.[0]?.unrealized.total_value}
              formatter={(value) =>
                formatCurrency({ value, currency: userSettings.data.currency })
              }
            />
          </Skeleton>
        </div>
        <Tabs
          size="small"
          activeKey={tab}
          onChange={(activeKey) => {
            setTab(activeKey);
          }}
          items={[
            {
              key: '1',
              label: 'Total',
              children: (
                <div>
                  {overViewBarRow(
                    'Value P/L',
                    totalPerformance.data?.[0]?.combined.value_pl,
                    totalPerformance.data?.[0]?.combined.value_pl_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Forex P/L',
                    totalPerformance.data?.[0]?.combined.forex_pl,
                    totalPerformance.data?.[0]?.combined.forex_pl_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Dividend',
                    totalPerformance.data?.[0]?.realized.dividends,
                    totalPerformance.data?.[0]?.realized.dividends_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Fees',
                    totalPerformance.data?.[0]?.realized?.transaction_cost
                      ? totalPerformance.data[0]?.realized.transaction_cost * -1
                      : 0,
                    totalPerformance.data?.[0]?.realized
                      ?.transaction_cost_percentage
                      ? totalPerformance.data[0]?.realized
                          .transaction_cost_percentage * -1
                      : 0,
                    loading
                  )}
                  <Divider className="m-2" />
                  {overViewBarRow(
                    'Total P/L',
                    totalPerformance.data?.[0]?.combined.total_pl,
                    totalPerformance.data?.[0]?.combined.total_pl_percentage,
                    loading
                  )}
                </div>
              ),
            },
            {
              key: '2',
              label: 'Unrealized',
              children: (
                <div>
                  {overViewBarRow(
                    'Value P/L',
                    totalPerformance.data?.[0]?.unrealized.value_pl,
                    totalPerformance.data?.[0]?.unrealized.value_pl_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Forex P/L',
                    totalPerformance.data?.[0]?.unrealized.forex_pl,
                    totalPerformance.data?.[0]?.unrealized.forex_pl_percentage,
                    loading
                  )}
                  <Divider className="m-2" />
                  {overViewBarRow(
                    'Total P/L',
                    totalPerformance.data?.[0]?.unrealized.total_pl,
                    totalPerformance.data?.[0]?.unrealized.total_pl_percentage,
                    loading
                  )}
                </div>
              ),
            },
            {
              key: '3',
              label: 'Realized',
              children: (
                <div>
                  {overViewBarRow(
                    'Value P/L',
                    totalPerformance.data?.[0]?.realized.value_pl,
                    totalPerformance.data?.[0]?.realized.value_pl_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Forex P/L',
                    totalPerformance.data?.[0]?.realized.forex_pl,
                    totalPerformance.data?.[0]?.realized.forex_pl_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Dividend',
                    totalPerformance.data?.[0]?.realized.dividends,
                    totalPerformance.data?.[0]?.realized.dividends_percentage,
                    loading
                  )}
                  {overViewBarRow(
                    'Fees',
                    totalPerformance.data?.[0]?.realized?.transaction_cost
                      ? totalPerformance.data[0]?.realized.transaction_cost * -1
                      : 0,
                    totalPerformance.data?.[0]?.realized
                      ?.transaction_cost_percentage
                      ? totalPerformance.data[0]?.realized
                          .transaction_cost_percentage * -1
                      : 0,
                    loading
                  )}
                  <Divider className="m-2" />
                  {overViewBarRow(
                    'Total P/L',
                    totalPerformance.data?.[0]?.realized.total_pl,
                    totalPerformance.data?.[0]?.realized.total_pl_percentage,
                    loading
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  }

  const navItems: MenuItem[] = [
    {
      key: '/authenticated/portfolio/',
      icon: <HomeOutlined />,
      label: (
        <span>
          <a className="" href="/authenticated/portfolio/"></a>
          <p className="inline-block">Portfolio</p>
        </span>
      ),
    },
    {
      key: '/authenticated/performance/',
      icon: <AreaChartOutlined />,
      label: (
        <span>
          <a href="/authenticated/performance/"></a>
          <p className="inline-block">Performance</p>
        </span>
      ),
    },
    {
      key: '/authenticated/actions/',
      icon: <InteractionOutlined />,
      label: (
        <span>
          <a href="/authenticated/actions/"></a>
          <p className="inline-block">Actions</p>
        </span>
      ),
    },
  ];

  const overViewBar: MenuItem[] = [
    {
      key: 'overviewBar',
      disabled: totalPerformance.isLoading,
      label: (
        <div className="cursor-default flex">
          <Skeleton
            className="w-20 pt-4"
            active={totalPerformance.isLoading}
            paragraph={false}
            loading={totalPerformance.isLoading}
          >
            <div>
              <Text>
                {formatCurrency({
                  value: totalPerformance.data?.[0]?.unrealized?.total_value,
                  currency: userSettings.data.currency,
                })}
              </Text>
            </div>
          </Skeleton>
          <div>
            <Divider type="vertical" />
          </div>
          <div>
            <Text className="mr-2">{timeFrameMap[timeFrame]} </Text>
          </div>
          <Skeleton
            className="w-12 pt-4"
            active={totalPerformance.isLoading}
            paragraph={false}
            loading={totalPerformance.isLoading}
          >
            <div>
              <Text>
                {formatPercentageWithColors({
                  value:
                    totalPerformance.data?.[0]?.unrealized.value_pl_percentage,
                  addIcon: true,
                })}
              </Text>
            </div>
          </Skeleton>
        </div>
      ),
      className: 'float-right',
      children: [
        {
          key: 'overviewDropdown',
          label: <OverViewBar loading={totalPerformance.isLoading} />,
          style: {
            width: 'fit-content',
            height: 'fit-content',
            margin: 0,
            padding: 0,
          },
          disabled: true,
        },
      ],
    },
  ];

  const userMenu: MenuItem[] = [
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
                  startOrchestrator({
                    body: {
                      functionName: 'stocktracker_orchestrator',
                      daysToUpdate: 7,
                    },
                  })
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

  const openMenu: MenuItem[] = [
    {
      key: 'openMenu',
      onClick: () => {
        setDrawerVisible(true);
      },
      icon: <MenuOutlined />,
    },
  ];

  // Menu items
  const topMenuLarge: MenuItem[] = [...userMenu, ...navItems];
  const topMenuSmall: MenuItem[] = [...userMenu, ...openMenu];

  if (authenticated()) {
    topMenuLarge.push(...overViewBar);
    topMenuSmall.push(...overViewBar);
  }

  return (
    <>
      <Menu
        selectedKeys={[current]}
        mode="horizontal"
        items={topMenuLarge}
        className="hidden sm:block"
      />
      <Menu
        selectedKeys={[current]}
        mode="horizontal"
        items={topMenuSmall}
        className="sm:hidden block"
      />
      <Drawer
        open={drawerVisible}
        closable={false}
        placement="left"
        onClose={() => {
          setDrawerVisible(false);
        }}
        bodyStyle={{ padding: 0, paddingTop: 0 }}
        width={200}
        footer={
          <div className="text-center">
            <Link
              type="secondary"
              href="/.auth/logout?post_logout_redirect_uri=/"
              onClick={() => {
                localStorage.clear();
              }}
            >
              Logout
            </Link>
          </div>
        }
      >
        <Menu items={navItems} selectedKeys={[current]} className="border-0" />
      </Drawer>
    </>
  );
}
