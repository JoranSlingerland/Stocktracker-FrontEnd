import {
  Divider,
  Button,
  message,
  Tabs,
  Typography,
  Input,
  AutoComplete,
  Select,
  Tooltip,
  List,
} from 'antd';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';
import AntdTable from '../../components/elements/antdTable';
import { currencyCodes } from '../../components/constants/currencyCodes';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import { startOrchestrator } from '../../components/services/orchestrator/startOrchestrator';
import { addUserData } from '../../components/services/add/addUserData';
import { orchestratorColumns } from '../../components/elements/columns/orchestratorColumns';
import { UseUserData } from '../../components/services/data/getUserData';
import { useListOrchestrator } from '../../components/services/orchestrator/OrchestratorList';
import { RedoOutlined } from '@ant-design/icons';

const { Text, Title, Link } = Typography;

// handle click functions
function handleLocalStorageClearClick() {
  localStorage.clear();
  if (localStorage.length === 0) {
    message.success('Local storage cleared');
  } else {
    message.error('Something went wrong :(');
  }
}

export default function Home({ userSettings }: { userSettings: UseUserData }) {
  const [tab, setTab] = useLocalStorageState('settingsTab', '1');
  const dimensions = useWindowDimensions();
  const {
    data: orchestratorListData,
    isLoading: orchestratorListIsLoading,
    refetchData: orchestratorListRefetch,
  } = useListOrchestrator({
    body: { days: 7 },
    enabled: tab === '3',
  });

  // handle click functions
  async function handleSaveAccountSettings() {
    if (userSettings.data) {
      await addUserData({
        body: userSettings.data,
      }).then(() => {
        userSettings.refetchData({
          cacheOnly: true,
        });
      });
    }
  }

  // constants
  const buttonRow = (
    title: string,
    description: string,
    button: JSX.Element
  ) => (
    <div className="grid grid-cols-2 grid-rows-2">
      <Title level={4}>{title}</Title>
      <div className="row-span-2 ml-auto mr-0">{button}</div>
      <Text>{description}</Text>
    </div>
  );

  const items = [
    {
      key: '1',
      Title: 'Account',
      label: 'Account',
      children: (
        <List
          size="large"
          loading={userSettings.isLoading}
          footer={
            <div className="flex flex-col items-center">
              <Button
                type="primary"
                onClick={() => {
                  handleSaveAccountSettings();
                }}
                disabled={
                  currencyCodes.find(
                    (o) => o.value === userSettings.data.currency
                  )
                    ? false
                    : true || userSettings.isLoading
                }
              >
                Save
              </Button>
            </div>
          }
        >
          <List.Item>
            <List.Item.Meta
              title={
                <Tooltip
                  placement="topLeft"
                  title={
                    <Text>
                      Get your Clearbit API Key at{' '}
                      <Link href="https://clearbit.com" target="_blank">
                        clearbit.com
                      </Link>
                    </Text>
                  }
                >
                  <Text strong>Clearbit API Key</Text>
                </Tooltip>
              }
              description={
                <Input.Password
                  className="w-72 sm:w-96"
                  value={userSettings.data.clearbit_api_key}
                  onChange={(e) => {
                    userSettings.overwriteData({
                      ...userSettings.data,
                      clearbit_api_key: e.target.value,
                    });
                  }}
                  size="small"
                />
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title={
                <Tooltip
                  placement="topLeft"
                  title={
                    <Text>
                      Get your Brandfetch API Key at{' '}
                      <Link
                        href="https://developers.brandfetch.com/"
                        target="_blank"
                      >
                        developers.brandfetch.com
                      </Link>
                    </Text>
                  }
                >
                  <Text strong>Brandfetch API Key</Text>
                </Tooltip>
              }
              description={
                <Input.Password
                  className="w-72 sm:w-96"
                  value={userSettings.data.brandfetch_api_key}
                  onChange={(e) => {
                    userSettings.overwriteData({
                      ...userSettings.data,
                      brandfetch_api_key: e.target.value,
                    });
                  }}
                  size="small"
                />
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title={
                <Tooltip
                  placement="topLeft"
                  title={
                    <Text>
                      Get your Alpha Vantage API Key at{' '}
                      <Link
                        href="https://www.alphavantage.co/support/#api-key"
                        target="_blank"
                      >
                        alphavantage.co
                      </Link>
                    </Text>
                  }
                >
                  <Text strong>Alpha Vantage API Key</Text>
                </Tooltip>
              }
              description={
                <Input.Password
                  className="w-72 sm:w-96"
                  value={userSettings.data.alpha_vantage_api_key}
                  onChange={(e) => {
                    userSettings.overwriteData({
                      ...userSettings.data,
                      alpha_vantage_api_key: e.target.value,
                    });
                  }}
                  size="small"
                />
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title={<Text strong>Currency</Text>}
              description={
                <AutoComplete
                  className="w-72 sm:w-96"
                  value={userSettings.data.currency}
                  onChange={(value) => {
                    userSettings.overwriteData({
                      ...userSettings.data,
                      currency: value,
                    });
                  }}
                  status={
                    currencyCodes.find(
                      (o) => o.value === userSettings.data.currency
                    )
                      ? ''
                      : 'error'
                  }
                  size="small"
                  options={currencyCodes}
                  filterOption={(inputValue, option) =>
                    option!.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={(value) => {
                    userSettings.overwriteData({
                      ...userSettings.data,
                      currency: value,
                    });
                  }}
                />
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title={<Text strong>Theme</Text>}
              description={
                <Select
                  value={userSettings.data.dark_mode}
                  onChange={(value) => {
                    userSettings.overwriteData({
                      ...userSettings.data,
                      dark_mode: value,
                    });
                  }}
                  options={[
                    { value: 'system', label: 'System' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                  ]}
                  loading={userSettings.isLoading}
                />
              }
            />
          </List.Item>
        </List>
      ),
    },
    {
      key: '2',
      title: 'Actions',
      label: 'Actions',
      children: (
        <div className="flex flex-col items-center">
          <div className="w-full px-2 columns-1">
            <div className="flex items-center justify-center">
              <Title level={3}>Safe changes</Title>
            </div>
            {buttonRow(
              'Refresh data',
              'This will Refresh all the data from scratch.',
              <Button
                onClick={() =>
                  startOrchestrator({
                    body: {
                      functionName: 'stocktracker_orchestrator',
                      daysToUpdate: 'all',
                    },
                  })
                }
                type="primary"
                size="large"
              >
                Refresh
              </Button>
            )}
            <Divider plain></Divider>
            {buttonRow(
              'Clear local storage',
              'This will clear all cached data in the local storage of the browser.',
              <Button
                onClick={() => handleLocalStorageClearClick()}
                type="primary"
                size="large"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: '3',
      title: 'Orchestrations',
      label: 'Orchestrations',
      children: (
        <div>
          <AntdTable
            isLoading={orchestratorListIsLoading}
            columns={orchestratorColumns}
            data={orchestratorListData}
            caption={
              <div className="flex flex-row-reverse">
                <Button
                  icon={<RedoOutlined />}
                  type="text"
                  shape="circle"
                  onClick={() => {
                    orchestratorListRefetch();
                  }}
                ></Button>
              </div>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Title className="flex items-center justify-center p-5" level={1}>
        Settings
      </Title>
      <Divider plain></Divider>
      <Tabs
        type="line"
        activeKey={tab}
        onChange={(key) => setTab(key)}
        items={items}
        tabPosition={
          dimensions.width === null || dimensions.width > 768 ? 'left' : 'top'
        }
      />
    </>
  );
}
