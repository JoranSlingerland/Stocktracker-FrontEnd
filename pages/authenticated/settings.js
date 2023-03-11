// pages\authenticated\settings.js

import {
  Divider,
  Button,
  message,
  Popconfirm,
  Tabs,
  Typography,
  Tag,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { ApiWithMessage, regularFetch } from '../../utils/api-utils';
import useWindowDimensions from '../../utils/useWindowDimensions';
import AntdTable from '../../components/antdTable';

const { Text, Title } = Typography;

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [orchestratorList, setOrchestratorList] = useState(null);
  const [orchestratorListIsLoading, setOrchestratorListIsLoading] =
    useState(true);

  // fetch functions
  async function getUserInfo() {
    await regularFetch('/.auth/me', undefined).then((data) => {
      setUserInfo(data);
    });
  }

  async function fetchOrchestratorList() {
    regularFetch(`/api/orchestartors/list`, [], 'POST', {
      userId: userInfo.clientPrincipal.userId,
      days: 7,
    }).then((data) => {
      setOrchestratorList(data);
      setOrchestratorListIsLoading(false);
    });
  }

  // handle click functions
  async function handleClickOrchestratorAction(
    url,
    runningMessage,
    successMessage,
    body
  ) {
    if (userInfo === null) {
      await getUserInfo();
    }
    ApiWithMessage(
      url,
      runningMessage,
      successMessage,
      'POST',
      body,
      'multipart/form-data'
    ).then(() => {
      fetchOrchestratorList();
    });
  }

  async function handleClick(url, runningMessage, successMessage) {
    ApiWithMessage(url, runningMessage, successMessage).then(() => {
      fetchOrchestratorList();
    });
  }

  function handlelocalstorageclearclick() {
    localStorage.clear();
    if (localStorage.length === 0) {
      message.success('Local storage cleared');
    } else {
      message.error('Something went wrong :(');
    }
  }

  // useEffects
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchOrchestratorList();
    }
  }, [userInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrchestratorList();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // constants
  const { height, width } = useWindowDimensions();

  const orchestratorColumns = [
    {
      title: 'Status',
      dataIndex: 'runtimeStatus',
      key: 'runtimeStatus',
      render: (text) => {
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
      render: (text) => <Text copyable>{text}</Text>,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <div className="">
          <Popconfirm
            title="Are you sure you want to terminate this orchestrator?"
            onConfirm={() => {
              handleClickOrchestratorAction(
                '/api/orchestartors/terminate',
                'Terminating orchestrator',
                'Orchestrator terminated',
                {
                  instanceId: record.instanceId,
                  userId: userInfo.clientPrincipal.userId,
                }
              );
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
              handleClickOrchestratorAction(
                '/api/orchestartors/purge',
                'Purging orchestrator',
                'Orchestrator purged',
                {
                  instanceId: record.instanceId,
                  userId: userInfo.clientPrincipal.userId,
                }
              );
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

  const items = [
    {
      key: '1',
      title: 'Actions',
      label: 'Actions',
      children: (
        <div className="flex flex-col items-center">
          {/* Safe changes */}
          <div className="w-full px-2 columns-1">
            <div className="flex items-center justify-center">
              <Title level={3}>Safe changes</Title>
            </div>
            <div className="grid grid-cols-2 grid-rows-2">
              <Title level={4}>Refresh data</Title>
              <div className="row-span-2 text-right">
                <Button
                  onClick={() =>
                    handleClickOrchestratorAction(
                      `/api/orchestrators/start`,
                      'Calling Orchestrator',
                      'Orchestration called, This will take a while',
                      {
                        userId: userInfo.clientPrincipal.userId,
                        functionName: 'stocktracker_orchestrator',
                        daysToUpdate: 'all',
                      }
                    )
                  }
                  type="primary"
                  size="large"
                >
                  Refresh
                </Button>
              </div>
              <div>This will Refresh all the data from scratch.</div>
            </div>
            <Divider plain></Divider>
            <div className="grid grid-cols-2 grid-rows-2">
              <Title level={4}>Create Containers</Title>
              <div className="row-span-2 text-right">
                <Button
                  onClick={() =>
                    handleClick(
                      '/api/create_cosmosdb_db_and_container',
                      'Creating Containers',
                      'Containers created :)'
                    )
                  }
                  type="primary"
                  size="large"
                >
                  Create
                </Button>
              </div>
              <div>
                This will create all containers and databases that do not exist
                yet.
              </div>
            </div>
            <Divider plain></Divider>
            <div className="grid grid-cols-2 grid-rows-2">
              <Title level={4}>Delete Containers</Title>
              <div className="row-span-2 text-right">
                <Button
                  onClick={() =>
                    handleClick(
                      '/api/delete_cosmosdb_container/output_only',
                      'Deleting containers',
                      'Containers deleted :)'
                    )
                  }
                  type="primary"
                  size="large"
                >
                  Delete
                </Button>
              </div>
              <div>
                This will delete all the containers except the input containers.
              </div>
            </div>
            <Divider plain></Divider>
            <div className="grid grid-cols-2 grid-rows-2">
              <Title level={4}>Clear local storage</Title>
              <div className="row-span-2 text-right">
                <Button
                  onClick={() => handlelocalstorageclearclick()}
                  type="primary"
                  size="large"
                >
                  Clear
                </Button>
              </div>
              <div>
                This will clear all cached data in the local storage of the
                browser.
              </div>
            </div>
          </div>
          <Divider plain></Divider>
          <div className="w-full px-2 columns-1">
            <div className="flex items-center justify-center text-xl">
              <Title type={'danger'} level={3}>
                Danger Zone
              </Title>
            </div>
            <div className="grid grid-cols-2 grid-rows-2">
              <Title level={4}>Delete all</Title>
              <div className="row-span-2 text-right">
                <Popconfirm
                  title="Delete all"
                  description="Are you sure you want to delete all containers"
                  okText="Yes"
                  arrow={false}
                  icon={false}
                  okButtonProps={{ danger: true, loading: false }}
                  onConfirm={() =>
                    handleClick(
                      `/api/delete_cosmosdb_container/all`,
                      'Deleting Containers',
                      'All Containers deleted :)'
                    )
                  }
                >
                  <Button danger type="primary" size="large">
                    Delete
                  </Button>
                </Popconfirm>
              </div>
              <div>
                This will delete all containers including the input containers.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      title: 'Orchestrations',
      label: 'Orchestrations',
      children: (
        <div>
          <AntdTable
            isLoading={orchestratorListIsLoading}
            columns={orchestratorColumns}
            data={orchestratorList}
          />
        </div>
      ),
    },
  ];

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
          defaultActiveKey="1"
          items={items}
          tabPosition={width === null || width > 768 ? 'left' : 'top'}
        />
      </div>
    </div>
  );
}
