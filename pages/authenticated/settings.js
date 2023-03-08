// pages\authenticated\settings.js

import {
  Divider,
  Button,
  message,
  Popconfirm,
  Tabs,
  Typography,
  Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import { ApiWithMessage } from '../../utils/api-utils';
import useWindowDimensions from '../../utils/useWindowDimensions';
import { regularFetch } from '../../utils/api-utils';
import AntdTable from '../../components/antdTable';

const { Text } = Typography;

export default function Home() {
  const [orchestratorList, setOrchestratorList] = useState(null);
  const [orchestratorListIsLoading, setOrchestratorListIsLoading] =
    useState(true);

  async function fetchOrchestratorList() {
    regularFetch(`/api/orchestartor_list/7`, []).then((data) => {
      setOrchestratorList(data);
      setOrchestratorListIsLoading(false);
    });
  }

  async function handleClickTerminateOrchestrator(instanceId) {
    ApiWithMessage(
      `/api/orchestartor_terminate/${instanceId}`,
      'Terminating orchestrator',
      'Orchestrator terminated'
    ).then(() => {
      fetchOrchestratorList();
    });
  }

  async function handleClickPurgeOrchestrator(instanceId) {
    ApiWithMessage(
      `/api/orchestartor_purge/${instanceId}`,
      'Purging orchestrator',
      'Orchestrator purged'
    ).then(() => {
      fetchOrchestratorList();
    });
  }

  useEffect(() => {
    fetchOrchestratorList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrchestratorList();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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

  const { height, width } = useWindowDimensions();

  const orchestratorColumns = [
    {
      title: 'Status',
      dataIndex: 'runtimeStatus',
      key: 'runtimeStatus',
      render: (text) => {
        if (text === 'Completed') {
          return <Text type="success">{text}</Text>;
        } else if (text === 'Failed') {
          return <Text type="danger">{text}</Text>;
        } else if (text === 'Suspended' || text === 'Terminated') {
          return <Text type="warning">{text}</Text>;
        } else if (text === 'Running' || text === 'Pending') {
          return (
            <span>
              <Spin size="small" className="mr-1" />
              <Text>{text}</Text>
            </span>
          );
        } else {
          return <Text>{text}</Text>;
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
              handleClickTerminateOrchestrator(record.instanceId);
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
              handleClickPurgeOrchestrator(record.instanceId);
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
            <div className="flex items-center justify-center text-xl">
              <h2>Safe changes</h2>
            </div>
            <div className="grid grid-cols-2 grid-rows-2">
              <div className="text-xl">Refresh data</div>
              <div className="row-span-2 text-right">
                <Button
                  onClick={() =>
                    handleClick(
                      `/api/orchestrators/stocktracker_orchestrator/all`,
                      'Calling Orchestrator',
                      'Orchestration called, This will take a while'
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
              <div className="text-xl">Create Containers</div>
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
              <div className="text-xl">Delete Containers</div>
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
              <div className="text-xl">Clear local storage</div>
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
              <h2 className="text-red-600">Danger Zone</h2>
            </div>
            <div className="grid grid-cols-2 grid-rows-2">
              <div className="text-xl">Delete all</div>
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
        <h1 className="flex items-center justify-center p-5 text-3xl py">
          Settings
        </h1>
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
