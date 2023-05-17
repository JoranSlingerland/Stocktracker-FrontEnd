import { Divider, Input, Typography } from 'antd';
import { useState, useEffect, useReducer } from 'react';
import AntdTable from '../../components/elements/antdTable';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import {
  TransactionsFormModal,
  StockFormModal,
} from '../../components/modules/formModal';
import { getTableDataBasic } from '../../components/services/data';
import { deleteInputItems } from '../../components/services/delete/deleteInputItems';
import {
  InputInvestedColumns,
  InputTransactionsColumns,
} from '../../components/elements/Columns';
import { UserSettings } from '../../components/services/data/getUserData';

const { Search } = Input;
const { Title } = Typography;

export default function Home({ userSettings }: { userSettings: UserSettings }) {
  const [InputTransactionsData, InputTransactionsDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState<any>();
  const [InputInvestedData, InputInvestedDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [InputInvestedSearchText, setInputInvestedSearchText] =
    useState<any>(undefined);

  // columns

  useEffect(() => {
    const abortController = new AbortController();

    getTableDataBasic({
      body: {
        containerName: 'input_transactions',
      },
      abortController,
      dispatcher: InputTransactionsDataDispatcher,
    });

    getTableDataBasic({
      body: {
        containerName: 'input_invested',
      },
      abortController,
      dispatcher: InputInvestedDataDispatcher,
    });
    return () => {
      abortController.abort();
    };
  }, []);

  async function deleteData(
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) {
    await deleteInputItems({
      body: {
        itemIds: id,
        container: container,
      },
    }).then(() => {
      if (container === 'input_invested') {
        const newData = InputInvestedData.data.filter(
          (item: any) => !id.includes(item.id)
        );
        InputInvestedDataDispatcher({
          type: 'FETCH_SUCCESS',
          payload: newData,
        });
      } else if (container === 'input_transactions') {
        const newData = InputTransactionsData.data.filter(
          (item: any) => !id.includes(item.id)
        );
        InputTransactionsDataDispatcher({
          type: 'FETCH_SUCCESS',
          payload: newData,
        });
      }
      overWriteTableData(container);
    });
  }

  async function overWriteTableData(
    container: 'input_invested' | 'input_transactions'
  ): Promise<void> {
    const dispatch =
      container === 'input_invested'
        ? InputInvestedDataDispatcher
        : InputTransactionsDataDispatcher;

    getTableDataBasic({
      body: {
        containerName: container,
      },
      abortController: new AbortController(),
      dispatcher: dispatch,
      overWrite: true,
    });
  }

  // Render
  return (
    <>
      <Title className="flex items-center justify-center p-5" level={1}>
        Actions
      </Title>
      <Divider plain></Divider>
      <Title className="mb-3" level={2}>
        Stock Transactions
      </Title>
      <AntdTable
        isLoading={InputTransactionsData.isLoading}
        columns={InputTransactionsColumns(deleteData)}
        data={InputTransactionsData.data}
        globalSorter={true}
        searchEnabled={true}
        searchText={InputTransactionsSearchText}
        tableProps={{
          size: 'small',
          pagination: {
            pageSize: 12,
            size: 'small',
            hideOnSinglePage: true,
            className: 'm-0',
          },
        }}
        caption={
          <div className="flex mx-1 mb-1">
            <div>
              <Search
                allowClear
                placeholder="Search"
                onChange={(e) => {
                  setInputTransactionsSearchText([e.target.value]);
                }}
                onSearch={(value) => {
                  setInputTransactionsSearchText([value]);
                }}
                className="max-w-xs"
              />
            </div>
            <div className="mb-1 ml-auto">
              <StockFormModal
                userSettings={userSettings}
                parentCallback={() => overWriteTableData('input_transactions')}
              />
            </div>
          </div>
        }
      />
      <Divider plain></Divider>
      <Title className="mb-3" level={2}>
        Money Transactions
      </Title>
      <AntdTable
        isLoading={InputInvestedData.isLoading}
        columns={InputInvestedColumns(userSettings.currency, deleteData)}
        data={InputInvestedData.data}
        globalSorter={true}
        searchEnabled={true}
        searchText={InputInvestedSearchText}
        tableProps={{
          size: 'small',
          pagination: {
            pageSize: 12,
            size: 'small',
            hideOnSinglePage: true,
            className: 'm-0',
          },
        }}
        caption={
          <div className="flex mx-1 mb-1">
            <div>
              <Search
                allowClear
                placeholder="Search"
                onChange={(e) => {
                  setInputInvestedSearchText([e.target.value]);
                }}
                onSearch={(value) => {
                  setInputInvestedSearchText([value]);
                }}
                className="max-w-xs"
              />
            </div>
            <div className="ml-auto">
              <TransactionsFormModal
                userSettings={userSettings}
                parentCallback={() => overWriteTableData('input_invested')}
              />
            </div>
          </div>
        }
      />
    </>
  );
}
