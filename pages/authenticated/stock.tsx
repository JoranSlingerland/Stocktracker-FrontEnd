import { useRouter } from 'next/router';
import { useReducer, useEffect, useState } from 'react';
import { Typography, Divider, Image, Tabs, Descriptions, Card } from 'antd';
import { getTableDataBasic } from '../../components/services/data';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import {
  LinkedinOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  formatCurrency,
  formatPercentageWithColors,
} from '../../components/utils/formatting';
import { UserSettings_Type } from '../../components/types/types';
import TagRow from '../../components/elements/TagRow';
import StatCard from '../../components/elements/StatCard';
import { convertTransactionsArray } from '../../components/utils/misc';

const { Text, Title, Link } = Typography;

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'instagram';

const platformIconMap: Record<Platform, React.ReactNode> = {
  facebook: <FacebookOutlined />,
  twitter: <TwitterOutlined />,
  linkedin: <LinkedinOutlined />,
  instagram: <InstagramOutlined />,
};

function socialsIcon(platform: Platform, url: string) {
  const icon = platformIconMap[platform];

  if (!icon) {
    return null;
  }

  return (
    <Link type="secondary" href={url} target="_blank">
      {icon}
    </Link>
  );
}

function Stocks({ userSettings }: { userSettings: UserSettings_Type }) {
  const router = useRouter();
  const stockSymbol = router.query.stock as string;
  const [stockData, stockDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [transactionsData, transactionsReducer] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true, fallback_data: [] })
  );
  const [tab, setTab] = useState('1');

  useEffect(() => {
    const abortController = new AbortController();

    getTableDataBasic({
      dispatcher: stockDataDispatcher,
      abortController,
      body: {
        containerName: 'stocks_held',
        symbol: stockSymbol,
      },
    });

    return function cancel() {
      abortController.abort();
    };
  }, [stockSymbol]);

  useEffect(() => {
    const abortController = new AbortController();

    if (tab === '2') {
      getTableDataBasic({
        dispatcher: transactionsReducer,
        abortController,
        body: {
          containerName: 'input_transactions',
          symbol: stockSymbol,
        },
      });
    }

    return function cancel() {
      abortController.abort();
    };
  }, [stockSymbol, tab]);

  const transactionsArray = convertTransactionsArray(transactionsData.data);
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Holdings',
      children: (
        <>
          <div className="grid grid-rows-2 grid-cols-2 md:grid-cols-4 md:grid-rows-1">
            <StatCard
              statisticProps={{
                title: 'Value',
                value: stockData.data?.[0]?.['unrealized']['total_value'],
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
            <StatCard
              statisticProps={{
                title:
                  stockData.data?.[0]?.['unrealized']['total_pl'] >= 0
                    ? 'Profit'
                    : 'Loss',
                value: stockData.data?.[0]?.['unrealized']['total_pl'],
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
            <StatCard
              statisticProps={{
                title: 'Dividends',
                value: stockData.data?.[0]?.['realized']['total_dividends'],
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
            <StatCard
              statisticProps={{
                title: 'Cost',
                value: stockData.data?.[0]?.['realized']['transaction_cost'],
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
          </div>
          <Descriptions
            title="Open Position"
            layout="vertical"
            column={{
              sm: 3,
              xs: 2,
            }}
            className="mt-2"
          >
            <Descriptions.Item label="Shares">
              {stockData.data?.[0]?.['unrealized']['quantity']}
            </Descriptions.Item>
            <Descriptions.Item label="Average cost">
              {formatCurrency({
                value: stockData.data?.[0]?.['unrealized']['cost_per_share'],
                currency: userSettings.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Current price">
              {formatCurrency({
                value: stockData.data?.[0]?.['unrealized']['close_value'],
                currency: userSettings.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                stockData.data?.[0]?.['unrealized']['forex_pl'] >= 0
                  ? 'Forex profit'
                  : 'Forex loss'
              }
              className="flex flex-row items-center"
            >
              {formatCurrency({
                value: stockData.data?.[0]?.['unrealized']['forex_pl'],
                currency: userSettings.currency,
              })}
              <Divider type="vertical" />
              {formatPercentageWithColors({
                value:
                  stockData.data?.[0]?.['unrealized']['forex_pl_percentage'],
                addIcon: true,
              })}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                stockData.data?.[0]?.['unrealized']['value_pl'] >= 0
                  ? 'Value profit'
                  : 'Value loss'
              }
            >
              {formatCurrency({
                value: stockData.data?.[0]?.['unrealized']['value_pl'],
                currency: userSettings.currency,
              })}
              <Divider type="vertical" />
              {formatPercentageWithColors({
                value:
                  stockData.data?.[0]?.['unrealized']['value_pl_percentage'],
                addIcon: true,
              })}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                stockData.data?.[0]?.['unrealized']['total_pl'] >= 0
                  ? 'Total profit'
                  : 'Total loss'
              }
            >
              {formatCurrency({
                value: stockData.data?.[0]?.['unrealized']['total_pl'],
                currency: userSettings.currency,
              })}
              <Divider type="vertical" />
              {formatPercentageWithColors({
                value:
                  stockData.data?.[0]?.['unrealized']['total_pl_percentage'],
                addIcon: true,
              })}
            </Descriptions.Item>
          </Descriptions>
          <Divider className="m-0" />
          <Descriptions
            title="Closed Position"
            layout="vertical"
            column={{
              sm: 3,
              xs: 2,
            }}
            className="mt-2 "
          >
            <Descriptions.Item label="Shares">
              {stockData.data?.[0]?.['realized']['quantity']}
            </Descriptions.Item>
            <Descriptions.Item label="Average cost">
              {formatCurrency({
                value: stockData.data?.[0]?.['realized']['cost_per_share_buy'],
                currency: userSettings.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Average sell price">
              {formatCurrency({
                value: stockData.data?.[0]?.['realized']['cost_per_share_sell'],
                currency: userSettings.currency,
              })}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                stockData.data?.[0]?.['realized']['forex_pl'] >= 0
                  ? 'Forex profit'
                  : 'Forex loss'
              }
            >
              {formatCurrency({
                value: stockData.data?.[0]?.['realized']['forex_pl'],
                currency: userSettings.currency,
              })}
              <Divider type="vertical" />
              {formatPercentageWithColors({
                value: stockData.data?.[0]?.['realized']['forex_pl_percentage'],
                addIcon: true,
              })}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                stockData.data?.[0]?.['realized']['value_pl'] >= 0
                  ? 'Value profit'
                  : 'Value loss'
              }
            >
              {formatCurrency({
                value: stockData.data?.[0]?.['realized']['value_pl'],
                currency: userSettings.currency,
              })}
              <Divider type="vertical" />
              {formatPercentageWithColors({
                value: stockData.data?.[0]?.['realized']['value_pl_percentage'],
                addIcon: true,
              })}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                stockData.data?.[0]?.['realized']['total_pl'] >= 0
                  ? 'Total profit'
                  : 'Total loss'
              }
            >
              {formatCurrency({
                value: stockData.data?.[0]?.['realized']['total_pl'],
                currency: userSettings.currency,
              })}
              <Divider type="vertical" />
              {formatPercentageWithColors({
                value: stockData.data?.[0]?.['realized']['total_pl_percentage'],
                addIcon: true,
              })}
            </Descriptions.Item>
          </Descriptions>
        </>
      ),
    },
    {
      key: '2',
      label: 'Actions',
      children: (
        <div>
          {transactionsArray.map((month, index) => {
            return (
              <div key={index} className="mt-2">
                <Title level={4}>{month.month}</Title>
                <div className="grid sm:grid-cols-2">
                  {month.values.map((value, index) => {
                    return (
                      <Card
                        key={index}
                        title={`${value.transaction_type} on ${value.date}`}
                        bordered={false}
                        size="small"
                        className="mt-2 mx-2"
                      >
                        <div className="flex flex-col">
                          <Text type="secondary">{`${
                            value.quantity
                          } shares at ${formatCurrency({
                            value: value.cost_per_share,
                            currency: value.currency,
                          })} per share:`}</Text>
                          <Text>{`${formatCurrency({
                            value: value.total_cost,
                            currency: value.currency,
                          })}`}</Text>
                          <Divider className="m-1" />
                          <Text type="secondary">{`transactions costs: ${formatCurrency(
                            {
                              value: value.transaction_costs,
                              currency: userSettings.currency,
                            }
                          )}`}</Text>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  const src = stockData.data?.[0]?.['meta']['icon'] || '/images/fallback.png';

  return (
    <div className="mt-2">
      <div className="flex space-x-2">
        <div>
          <Image src={src} width={80} alt="Logo" preview={false} />
        </div>
        <div className="flex flex-col ">
          <Title level={3}>{stockData.data?.[0]?.['meta']['name']}</Title>
          <Text type="secondary" copyable>
            {stockData.data?.[0]?.['meta']['symbol']}
          </Text>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-2">
        {stockData.data?.[0]?.['meta']['links']?.map((link: any) => {
          return socialsIcon(link.name, link.url);
        })}
        <Divider type="vertical" />
        <Link
          type="secondary"
          target="_blank"
          href={`https://${stockData.data?.[0]?.['meta']['domain']}`}
        >
          {stockData.data?.[0]?.['meta']['domain']}
        </Link>
      </div>

      <Text>{stockData.data?.[0]?.['meta']['description']}</Text>

      <Divider className="m-2" plain></Divider>

      <TagRow
        items={[
          { value: stockData.data?.[0]?.['meta']['country'] },
          { value: stockData.data?.[0]?.['meta']['sector'] },
          { value: stockData.data?.[0]?.['currency'] },
          {
            value: stockData.data?.[0]?.['fully_realized'] ? 'Closed' : 'Open',
          },
        ]}
      />
      <Tabs
        activeKey={tab}
        onChange={(activeKey) => {
          setTab(activeKey);
        }}
        items={tabItems}
      />
    </div>
  );
}

export default Stocks;
