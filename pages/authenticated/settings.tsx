import {
  Divider,
  Button,
  message,
  Popconfirm,
  Tabs,
  Typography,
  Tag,
  Input,
  Switch,
  Skeleton,
  AutoComplete,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useEffect, useReducer } from 'react';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';
import AntdTable from '../../components/elements/antdTable';
import {
  UserInfo_Type,
  userSettingsDispatch_Type,
  UserSettings_Type,
} from '../../components/types/types';
import { currencyCodes } from '../../components/constants/currencyCodes';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import { getUserData } from '../../components/services/data';
import {
  startOrchestrator,
  fetchOrchestratorList,
  purgeOrchestrator,
  terminateOrchestrator,
} from '../../components/services/orchestrator';
import {
  createCosmosDbAndContainer,
  deleteCosmosDbContainer,
} from '../../components/services/privileged';
import { addUserData } from '../../components/services/add';

const { Text, Title, Link } = Typography;

export default function Home({
  userInfo,
  userSettings,
  userSettingsDispatch,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
  userSettingsDispatch: (action: userSettingsDispatch_Type) => void;
}) {
  const [orchestratorList, orchestratorDispatch] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [tab, setTab] = useLocalStorageState('settingsTab', '1');

  // handle click functions
  function handleLocalStorageClearClick() {
    localStorage.clear();
    if (localStorage.length === 0) {
      message.success('Local storage cleared');
    } else {
      message.error('Something went wrong :(');
    }
  }

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
    if (userInfo.clientPrincipal.userId !== '' && tab === '3') {
      const abortController = new AbortController();
      fetchOrchestratorList({
        body: { userId: userInfo.clientPrincipal.userId, days: 7 },
        dispatcher: orchestratorDispatch,
        abortController,
      });
      return () => abortController.abort();
    }
  }, [userInfo, tab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userInfo.clientPrincipal.userId !== '' && tab === '3') {
        const abortController = new AbortController();
        fetchOrchestratorList({
          body: { userId: userInfo.clientPrincipal.userId, days: 7 },
          dispatcher: orchestratorDispatch,
          abortController,
          background: true,
        });
        return () => abortController.abort();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [userInfo, tab]);

  // constants
  const dimensions = useWindowDimensions();

  const orchestratorColumns = [
    {
      title: 'Status',
      dataIndex: 'runtimeStatus',
      key: 'runtimeStatus',
      render: (text: string) => {
        if (text === 'Completed') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {text}
            </Tag>
          );
        } else if (text === 'Failed') {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              {text}
            </Tag>
          );
        } else if (text === 'Suspended' || text === 'Terminated') {
          return (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              {text}
            </Tag>
          );
        } else if (text === 'Running' || text === 'Pending') {
          return (
            <Tag icon={<SyncOutlined spin />} color="processing">
              {text}
            </Tag>
          );
        } else {
          return <Tag color="default">{text}</Tag>;
        }
      },
    },
    {
      title: 'Created Time',
      dataIndex: 'createdTime',
      key: 'createdTime',
    },
    {
      title: 'Last Updated Time',
      dataIndex: 'lastUpdatedTime',
      key: 'lastUpdatedTime',
    },
    {
      title: 'Instance ID',
      dataIndex: 'instanceId',
      key: 'instanceId',
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text: string, record: any) => (
        <div className="">
          <Popconfirm
            title="Are you sure you want to terminate this orchestrator?"
            onConfirm={() => {
              terminateOrchestrator({
                body: {
                  instanceId: record.instanceId,
                  userId: userInfo.clientPrincipal.userId,
                },
              });
            }}
            okText="Yes"
            cancelText="No"
            arrow={false}
            icon={false}
          >
            <Button
              danger
              disabled={
                record.runtimeStatus === 'Running' ||
                record.runtimeStatus === 'Pending'
                  ? false
                  : true
              }
              className="mb-1 mr-1"
              size="small"
            >
              Terminate
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to purge this orchestrator?"
            onConfirm={() => {
              purgeOrchestrator({
                body: {
                  userId: userInfo.clientPrincipal.userId,
                  instanceId: record.instanceId,
                },
              });
            }}
            okText="Yes"
            cancelText="No"
            arrow={false}
            icon={false}
          >
            <Button size="small" danger>
              Purge
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
              <Switch
                checked={userSettings.dark_mode}
                onChange={(checked) => {
                  userSettingsDispatch({
                    type: 'setDarkMode',
                    payload: checked,
                  });
                }}
                className="mt-2"
                loading={userSettings.isLoading}
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
                      userId: userInfo.clientPrincipal.userId,
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
  if (userInfo.clientPrincipal.userRoles.includes('admin')) {
    items.push({
      key: '4',
      title: 'Admin',
      label: 'Admin',
      children: (
        <div className="flex flex-col items-center">
          <div className="w-full px-2 columns-1">
            <div className="flex items-center justify-center">
              <Title level={3}>Container actions</Title>
            </div>
            {buttonRow(
              'Create Containers',
              'This will create all containers and databases that do not exist yet.',
              <Button
                onClick={() => createCosmosDbAndContainer()}
                type="primary"
                size="large"
              >
                Create
              </Button>
            )}
            <Divider plain></Divider>
            <div className="w-full px-2 columns-1">
              <div className="flex flex-col items-center justify-center text-xl">
                <Title type={'danger'} level={3}>
                  Danger Zone
                </Title>
                <Text type={'danger'}>
                  Actions below can cause permanent data loss
                </Text>
              </div>
              {buttonRow(
                'Delete output containers',
                'This will delete all the containers except the input containers.',
                <Popconfirm
                  title="Delete output containers?"
                  description="Are you sure you want to delete the output containers"
                  okText="Yes"
                  arrow={false}
                  icon={false}
                  okButtonProps={{ danger: true, loading: false }}
                  onConfirm={() =>
                    deleteCosmosDbContainer({
                      body: {
                        containersToDelete: 'output_only',
                      },
                    })
                  }
                >
                  <Button danger type="primary" size="large">
                    Delete
                  </Button>
                </Popconfirm>
              )}
              <Divider plain></Divider>
              {buttonRow(
                'Delete all containers',
                'This will delete all containers including the input containers.',
                <Popconfirm
                  title="Delete all"
                  description="Are you sure you want to delete all containers"
                  okText="Yes"
                  arrow={false}
                  icon={false}
                  okButtonProps={{ danger: true, loading: false }}
                  onConfirm={() =>
                    deleteCosmosDbContainer({
                      body: {
                        containersToDelete: 'all',
                      },
                    })
                  }
                >
                  <Button danger type="primary" size="large">
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
      ),
    });
  }

  return (
    <div>
      <div>
        <Title className="flex items-center justify-center p-5" level={1}>
          Settings
        </Title>
      </div>
      <Divider plain></Divider>
      <div>
        <Tabs
          type="line"
          activeKey={tab}
          onChange={(key) => setTab(key)}
          items={items}
          tabPosition={
            dimensions.width === null || dimensions.width > 768 ? 'left' : 'top'
          }
        />
      </div>
    </div>
  );
}
