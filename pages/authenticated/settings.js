import { Modal, Divider, Button, message } from 'antd';
import { useState } from 'react';

export default function Home() {
  const [isModalDeleteVisible, setIsDeleteModalVisible] = useState(false);

  const handleClickDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleModalCancel = () => {
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
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 202
    ) {
      hide();
      message.success(successMessage);
    } else {
      hide();
      message.error('Something went wrong :(');
    }
  }

  async function handleClick(url, runningMessage, successMessage) {
    callApi(url, runningMessage, successMessage);
    setIsDeleteModalVisible(false);
  }
  function handlelocalstorageclearclick() {
    localStorage.clear();
    if (localStorage.length === 0) {
      message.success('Local storage cleared');
    } else {
      message.error('Something went wrong :(');
    }
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
        <div className="w-full max-w-3xl px-2 columns-1">
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
        <div className="w-full max-w-3xl px-2 columns-1">
          <div className="flex items-center justify-center text-xl">
            <h2 className="text-red-600">Danger Zone</h2>
          </div>
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
                    `/api/delete_cosmosdb_container/all`,
                    'Deleting Containers',
                    'All Containers deleted :)'
                  )
                }
                onCancel={handleModalCancel}
              >
                <p>Are you sure you want to delete all containers?</p>
              </Modal>
            </div>
            <div>
              This will delete all containers including the input containers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
