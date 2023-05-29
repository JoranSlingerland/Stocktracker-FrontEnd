import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Typography,
  Divider,
  Image,
  Tabs,
  Descriptions,
  Card,
  Skeleton,
} from 'antd';
import {
  LinkedinOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  formatCurrency,
  formatPercentage,
  formatPercentageWithColors,
} from '../../components/utils/formatting';
import TagRow from '../../components/elements/TagRow';
import StatCard from '../../components/elements/StatCard';
import { convertTransactionsArray } from '../../components/utils/misc';
import { UseUserData } from '../../components/services/user/get';
import { useTableDataBasicStocksHeld } from '../../components/services/table/basic/stocksHeld';
import { useTableDataBasicInputTransactions } from '../../components/services/table/basic//inputTransactions';

const { Text, Title, Link } = Typography;

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'instagram';

const platformIconMap: Record<Platform, React.ReactNode> = {
  facebook: <FacebookOutlined />,
  twitter: <TwitterOutlined />,
  linkedin: <LinkedinOutlined />,
  instagram: <InstagramOutlined />,
};

function isPlatform(name: string): name is Platform {
  return ['facebook', 'twitter', 'linkedin', 'instagram'].includes(
    name as Platform
  );
}

function socialsIcon(platform: string, url: string) {
  if (!isPlatform(platform)) {
    return null;
  }

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

function Stocks({ userSettings }: { userSettings: UseUserData }) {
  const router = useRouter();
  const stockSymbol = router.query.stock as string;
  const [tab, setTab] = useState('1');
  const { data: stockData, isLoading: stockIsLoading } =
    useTableDataBasicStocksHeld({
      query: {
        containerName: 'stocks_held',
        symbol: stockSymbol,
      },
      enabled: !!stockSymbol,
    });
  const { data: transactionsData, isLoading: transactionsIsLoading } =
    useTableDataBasicInputTransactions({
      query: {
        containerName: 'input_transactions',
        symbol: stockSymbol,
      },
      enabled: !!stockSymbol && tab === '2',
    });

  const transactionsArray = convertTransactionsArray(transactionsData);
  const DescriptionSkeletonProps = {
    active: true,
    paragraph: false,
    title: { width: '80px' },
  };
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
                value: stockData?.[0]?.['unrealized']['total_value'],
                loading: stockIsLoading,
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.data.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
            <StatCard
              statisticProps={{
                title:
                  (stockData?.[0]?.['unrealized']['total_pl'] ?? 0) >= 0
                    ? 'Profit'
                    : 'Loss',
                value: stockData?.[0]?.['unrealized']['total_pl'],
                loading: stockIsLoading,
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.data.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
            <StatCard
              statisticProps={{
                title: 'Dividends',
                value: stockData?.[0]?.['realized']['total_dividends'],
                loading: stockIsLoading,
                formatter: (value) =>
                  formatCurrency({
                    value,
                    currency: userSettings.data.currency,
                  }),
              }}
              className="m-2 p-0"
              size="small"
            />
            <StatCard
              statisticProps={{
                title: 'Weight',
                value: stockData?.[0]?.['weight'],
                loading: stockIsLoading,
                formatter: (value) => formatPercentage(value),
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
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {stockData?.[0]?.['unrealized']['quantity']}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item label="Average cost">
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['unrealized']['cost_per_share'],
                  currency: userSettings.data.currency,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item label="Current price">
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['unrealized']['close_value'],
                  currency: userSettings.data.currency,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                (stockData?.[0]?.['unrealized']['forex_pl'] ?? 0) >= 0
                  ? 'Forex profit'
                  : 'Forex loss'
              }
              className="flex flex-row items-center"
            >
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['unrealized']['forex_pl'],
                  currency: userSettings.data.currency,
                })}
                <Divider type="vertical" />
                {formatPercentageWithColors({
                  value: stockData?.[0]?.['unrealized']['forex_pl_percentage'],
                  addIcon: true,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                (stockData?.[0]?.['unrealized']?.['value_pl'] ?? 0) >= 0
                  ? 'Value profit'
                  : 'Value loss'
              }
            >
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['unrealized']['value_pl'],
                  currency: userSettings.data.currency,
                })}
                <Divider type="vertical" />
                {formatPercentageWithColors({
                  value: stockData?.[0]?.['unrealized']['value_pl_percentage'],
                  addIcon: true,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                (stockData?.[0]?.['unrealized']['total_pl'] ?? 0) >= 0
                  ? 'Total profit'
                  : 'Total loss'
              }
            >
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['unrealized']['total_pl'],
                  currency: userSettings.data.currency,
                })}
                <Divider type="vertical" />
                {formatPercentageWithColors({
                  value: stockData?.[0]?.['unrealized']['total_pl_percentage'],
                  addIcon: true,
                })}
              </Skeleton>
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
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {stockData?.[0]?.['realized']['quantity']}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item label="Average cost">
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['realized']['cost_per_share_buy'],
                  currency: userSettings.data.currency,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item label="Average sell price">
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['realized']['cost_per_share_sell'],
                  currency: userSettings.data.currency,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                (stockData?.[0]?.['realized']['forex_pl'] ?? 0) >= 0
                  ? 'Forex profit'
                  : 'Forex loss'
              }
            >
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['realized']['forex_pl'],
                  currency: userSettings.data.currency,
                })}
              </Skeleton>
              <Divider type="vertical" />
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatPercentageWithColors({
                  value: stockData?.[0]?.['realized']['forex_pl_percentage'],
                  addIcon: true,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                (stockData?.[0]?.['realized']['value_pl'] ?? 0) >= 0
                  ? 'Value profit'
                  : 'Value loss'
              }
            >
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['realized']['value_pl'],
                  currency: userSettings.data.currency,
                })}
                <Divider type="vertical" />
                {formatPercentageWithColors({
                  value: stockData?.[0]?.['realized']['value_pl_percentage'],
                  addIcon: true,
                })}
              </Skeleton>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                (stockData?.[0]?.['realized']['total_pl'] ?? 0) >= 0
                  ? 'Total profit'
                  : 'Total loss'
              }
            >
              <Skeleton loading={stockIsLoading} {...DescriptionSkeletonProps}>
                {formatCurrency({
                  value: stockData?.[0]?.['realized']['total_pl'],
                  currency: userSettings.data.currency,
                })}
                <Divider type="vertical" />
                {formatPercentageWithColors({
                  value: stockData?.[0]?.['realized']['total_pl_percentage'],
                  addIcon: true,
                })}
              </Skeleton>
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
                <Skeleton
                  paragraph={false}
                  title={{ width: '100px' }}
                  active
                  loading={transactionsIsLoading}
                >
                  <Title level={4}>{month.month}</Title>
                </Skeleton>
                <div className="grid sm:grid-cols-2">
                  {month.values.map((value, index) => {
                    return (
                      <Card
                        key={index}
                        title={
                          <Skeleton
                            paragraph={false}
                            active
                            loading={transactionsIsLoading}
                          >
                            {value.transaction_type} on {value.date}
                          </Skeleton>
                        }
                        bordered={false}
                        size="small"
                        className="mt-2 mx-2"
                        loading={transactionsIsLoading}
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
                              value: value.transaction_cost,
                              currency: userSettings.data.currency,
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

  return (
    <div className="mt-2">
      <div className="flex space-x-2">
        <div>
          {stockIsLoading ? (
            <Skeleton.Image active />
          ) : (
            <Image
              src={stockData?.[0]?.['meta']['icon']}
              width={96}
              alt="Logo"
              preview={false}
            />
          )}
        </div>
        <Skeleton
          title={false}
          paragraph={{
            rows: 2,
            width: ['80px', '80px'],
          }}
          active
          loading={stockIsLoading}
        >
          <div className="flex flex-col">
            <Title level={3}>{stockData?.[0]?.['meta']['name']}</Title>
            <Text type="secondary" copyable>
              {stockData?.[0]?.['meta']['symbol']}
            </Text>
          </div>
        </Skeleton>
      </div>
      <Skeleton
        paragraph={false}
        title={{ width: '200px' }}
        loading={stockIsLoading}
        active
        className="mt-2"
      >
        <div className="flex flex-row items-center space-x-2">
          {stockData?.[0]?.['meta']['links']?.map((link) => {
            return socialsIcon(link.name, link.url);
          })}
          <Divider type="vertical" />
          <Link
            type="secondary"
            target="_blank"
            href={`https://${stockData?.[0]?.['meta']['domain']}`}
          >
            {stockData?.[0]?.['meta']['domain']}
          </Link>
        </div>
      </Skeleton>
      <Skeleton title={false} active loading={stockIsLoading} className="mt-2">
        <Text>{stockData?.[0]?.['meta']['description']}</Text>
      </Skeleton>
      <Divider className="m-2" plain></Divider>
      <Skeleton
        paragraph={false}
        title={{ width: '200px' }}
        active
        loading={stockIsLoading}
      >
        <TagRow
          items={[
            { value: stockData?.[0]?.['meta']['country'] },
            { value: stockData?.[0]?.['meta']['sector'] },
            { value: stockData?.[0]?.['currency'] },
            {
              value:
                stockData?.[0]?.['fully_realized'] !== undefined
                  ? stockData?.[0]['fully_realized']
                    ? 'Closed'
                    : 'Open'
                  : undefined,
            },
          ]}
        />
      </Skeleton>
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
