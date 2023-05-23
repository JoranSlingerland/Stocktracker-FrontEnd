import {
  Divider,
  Button,
  message,
  Tabs,
  Typography,
  Input,
  Skeleton,
  AutoComplete,
  Select,
} from 'antd';
import { useEffect, useReducer } from 'react';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';
import AntdTable from '../../components/elements/antdTable';
import { currencyCodes } from '../../components/constants/currencyCodes';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import { getUserData } from '../../components/services/data/getUserData';
import { startOrchestrator } from '../../components/services/orchestrator/startOrchestrator';
import { addUserData } from '../../components/services/add/addUserData';
import { orchestratorColumns } from '../../components/elements/columns/orchestratorColumns';
import {
  UserSettings,
  userDataActions,
} from '../../components/services/data/getUserData';
import {
  listOrchestrator,
  listOrchestratorReducer,
  listOrchestratorInitialState,
} from '../../components/services/orchestrator/OrchestratorList';

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

export default function Home({
  userSettings,
  userSettingsDispatch,
}: {
  userSettings: UserSettings;
  userSettingsDispatch: (action: userDataActions) => void;
}) {
  const [orchestratorList, orchestratorDispatch] = useReducer(
    listOrchestratorReducer,
    listOrchestratorInitialState({ isLoading: true })
  );
  const [tab, setTab] = useLocalStorageState('settingsTab', '1');
  const dimensions = useWindowDimensions();

  // handle click functions
  async function handleSaveAccountSettings() {
    userSettingsDispatch({ type: 'setLoading', payload: true });
    await addUserData({
      body: userSettings,
    }).then(() => {
      getUserData({
        overWrite: true,
      }).then(({ response }) => {
        userSettingsDispatch({
          type: 'setAll',
          payload: response,
        });
      });
    });
  }

  // useEffects
  useEffect(() => {
    if (tab === '3') {
      const abortController = new AbortController();
      listOrchestrator({
        body: { days: 7 },
        dispatcher: orchestratorDispatch,
        abortController,
      });
      return () => abortController.abort();
    }
  }, [tab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tab === '3') {
        const abortController = new AbortController();
        listOrchestrator({
          body: { days: 7 },
          dispatcher: orchestratorDispatch,
          abortController,
          background: true,
        });
        return () => abortController.abort();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [tab]);

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
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <Title level={3}>Account</Title>
          </div>
          <div className="flex flex-col mt-2">
            <Text strong>Clearbit API Key</Text>
            <div className="mt-2 w-72 sm:w-96">
              {userSettings.isLoading ? (
                <Skeleton
                  active={true}
                  paragraph={{ rows: 1 }}
                  title={false}
                ></Skeleton>
              ) : (
                <Input.Password
                  value={userSettings.clearbit_api_key}
                  onChange={(e) => {
                    userSettingsDispatch({
                      type: 'setClearbitApiKey',
                      payload: e.target.value,
                    });
                  }}
                  size="small"
                />
              )}
            </div>

            <Text className="mt-1" type="secondary">
              Get your Clearbit API Key at{' '}
              <Link
                type="secondary"
                href="https://clearbit.com"
                target="_blank"
              >
                clearbit.com
              </Link>
            </Text>
          </div>
          <Divider />
          <div className="flex flex-col mt-2">
            <Text strong>Brandfetch API Key</Text>
            <div className="mt-2 w-72 sm:w-96">
              {userSettings.isLoading ? (
                <Skeleton
                  active={true}
                  paragraph={{ rows: 1 }}
                  title={false}
                ></Skeleton>
              ) : (
                <Input.Password
                  value={userSettings.brandfetch_api_key}
                  onChange={(e) => {
                    userSettingsDispatch({
                      type: 'setBrandfetchApiKey',
                      payload: e.target.value,
                    });
                  }}
                  size="small"
                />
              )}
            </div>

            <Text className="mt-1" type="secondary">
              Get your Brandfetch API Key at{' '}
              <Link
                type="secondary"
                href="https://developers.brandfetch.com/"
                target="_blank"
              >
                developers.brandfetch.com
              </Link>
            </Text>
          </div>
          <Divider />
          <div className="flex flex-col">
            <Text strong>Alpha Vantage API Key</Text>
            <div className="mt-2 w-72 sm:w-96">
              {userSettings.isLoading ? (
                <Skeleton
                  active={true}
                  paragraph={{ rows: 1 }}
                  title={false}
                ></Skeleton>
              ) : (
                <Input.Password
                  value={userSettings.alpha_vantage_api_key}
                  onChange={(e) => {
                    userSettingsDispatch({
                      type: 'setAlphaVantageApiKey',
                      payload: e.target.value,
                    });
                  }}
                  size="small"
                />
              )}
            </div>
            <Text className="mt-1" type="secondary">
              Get your Alpha Vantage API Key at{' '}
              <Link
                type="secondary"
                href="https://www.alphavantage.co/support/#api-key"
                target="_blank"
              >
                alphavantage.co
              </Link>
            </Text>
          </div>
          <Divider />
          <div className="flex flex-col">
            <Text strong>Currency</Text>
            <div className="mt-2 w-72 sm:w-96">
              {userSettings.isLoading ? (
                <Skeleton
                  active={true}
                  paragraph={{ rows: 1 }}
                  title={false}
                ></Skeleton>
              ) : (
                <AutoComplete
                  value={userSettings.currency}
                  onChange={(value) => {
                    userSettingsDispatch({
                      type: 'setCurrency',
                      payload: value,
                    });
                  }}
                  status={
                    currencyCodes.find((o) => o.value === userSettings.currency)
                      ? ''
                      : 'error'
                  }
                  size="small"
                  className="w-full"
                  options={currencyCodes}
                  filterOption={(inputValue, option) =>
                    option!.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={(value) => {
                    userSettingsDispatch({
                      type: 'setCurrency',
                      payload: value,
                    });
                  }}
                />
              )}
            </div>
            <Text className="mt-1" type="secondary">
              Set your currency
            </Text>
          </div>
          <Divider />
          <div className="flex flex-col">
            <Text strong>Dark mode</Text>
            <div>
              <Select
                value={userSettings.dark_mode}
                onChange={(value) => {
                  userSettingsDispatch({
                    type: 'setDarkMode',
                    payload: value,
                  });
                }}
                options={[
                  { value: 'system', label: 'System' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                ]}
                loading={userSettings.isLoading}
                className="mt-2"
              />
            </div>
            <Text className="mt-1" type="secondary">
              Toggle dark mode
            </Text>
          </div>
          <Divider />
          <div className="flex flex-col items-center">
            <Button
              type="primary"
              onClick={() => {
                handleSaveAccountSettings();
              }}
              className="mt-2"
              disabled={
                currencyCodes.find((o) => o.value === userSettings.currency)
                  ? false
                  : true || userSettings.isLoading
              }
            >
              Save
            </Button>
          </div>
        </div>
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
            isLoading={orchestratorList.isLoading}
            columns={orchestratorColumns}
            data={orchestratorList.data}
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
