import { Modal, Divider, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import PrimeFaceTable from '../../components/PrimeFaceTable';

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default function Home() {
  const [isModalTruncateVisible, setIsTruncateModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsDeleteModalVisible] = useState(false);

  const handleClickDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleClickTruncate = () => {
    setIsTruncateModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsTruncateModalVisible(false);
    setIsDeleteModalVisible(false);
  };

  async function callApi(url, runningMessage, successMessage) {
    const hide = message.loading(runningMessage, 10);
    const response = await fetch(url);
    try {
      const body = await response.json();
    } catch (error) {
      console.log('error', error);
    }
    if (response.status === 200) {
      hide();
      message.success(successMessage);
    }
    if (response.status === 201) {
      hide();
      message.success(successMessage);
    }
    if (response.status === 202) {
      hide();
      message.success(successMessage);
    } else {
      hide();
      message.error('Something went wrong :(');
    }
  }

  async function handleClick(url, runningMessage, successMessage) {
    callApi(url, runningMessage, successMessage);
    setIsTruncateModalVisible(false);
    setIsDeleteModalVisible(false);
  }

  return (
    <div className="w-full">
      {/* Titel */}
      <div>
        <h1 className="flex items-center justify-center p-5 text-3xl py">
          Settings
        </h1>
      </div>
      <Divider plain></Divider>

      <div className="flex flex-col items-center">
        {/* Safe changes */}
        <div className="columns-1">
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
            <div className="text-xl">Create Tables</div>
            <div className="row-span-2 text-right">
              <Button
                onClick={() =>
                  handleClick(
                    '/api/create_sql_tables',
                    'Creating tables',
                    'Tables created :)'
                  )
                }
                type="primary"
                size="large"
              >
                Create
              </Button>
            </div>
            <div>This will create all tables that do not exist yet.</div>
          </div>
          <Divider plain></Divider>
          <div className="grid grid-cols-2 grid-rows-2">
            <div className="text-xl">Truncate Tables</div>
            <div className="row-span-2 text-right">
              <Button
                onClick={() =>
                  handleClick(
                    '/api/truncate_sql_tables/output_only',
                    'Truncating Tables',
                    'Tables truncated :)'
                  )
                }
                type="primary"
                size="large"
              >
                Truncate
              </Button>
            </div>
            <div>
              This will truncate all the tables except the input tables.
            </div>
          </div>
          <Divider plain></Divider>
          <div className="grid grid-cols-2 grid-rows-2">
            <div className="text-xl">Delete Tables</div>
            <div className="row-span-2 text-right">
              <Button
                onClick={() =>
                  handleClick(
                    '/api/delete_sql_tables/output_only',
                    'Deleting tables',
                    'Tables deleted :)'
                  )
                }
                type="primary"
                size="large"
              >
                Delete
              </Button>
            </div>
            <div>This will delete all the tables except the input tables.</div>
          </div>
        </div>
        <Divider plain></Divider>
        <div className="columns-1">
          <div className="flex items-center justify-center text-xl">
            <h2 className="text-red-600">Danger Zone</h2>
          </div>
          <div className="grid grid-cols-2 grid-rows-2">
            <div className="text-xl">Truncate all</div>
            <div className="row-span-2 text-right">
              <Button onClick={handleClickTruncate} type="primary" size="large">
                Truncate
              </Button>
              <Modal
                title="Truncate all"
                visible={isModalTruncateVisible}
                onOk={() =>
                  handleClick(
                    `/api/truncate_sql_tables/all`,
                    'Truncating Tables',
                    'All Tables truncated :)'
                  )
                }
                onCancel={handleModalCancel}
              >
                <p>Are you sure you want to truncate all tables?</p>
              </Modal>
            </div>
            <div>This will truncate all tables including the input tables.</div>
          </div>
          <Divider plain></Divider>
          <div className="grid grid-cols-2 grid-rows-2">
            <div className="text-xl">Delete all</div>
            <div className="row-span-2 text-right">
              <Button onClick={handleClickDelete} type="primary" size="large">
                Delete
              </Button>
              <Modal
                title="Delete all"
                visible={isModalDeleteVisible}
                onOk={() =>
                  handleClick(
                    `/api/delete_sql_tables/all`,
                    'Deleting Tables',
                    'All Tables deleted :)'
                  )
                }
                onCancel={handleModalCancel}
              >
                <p>Are you sure you want to delete all tables?</p>
              </Modal>
            </div>
            <div>This will delete all tables including the input tables.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
