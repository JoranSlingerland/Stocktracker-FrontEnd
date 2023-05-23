import { Divider, Input, Typography } from 'antd';
import { useState, useEffect, useReducer } from 'react';
import AntdTable from '../../components/elements/antdTable';
import {
  TransactionsFormModal,
  StockFormModal,
} from '../../components/modules/formModal';
import { deleteInputItems } from '../../components/services/delete/deleteInputItems';
import { InputInvestedColumns } from '../../components/elements/columns/InputInvestedColumns';
import { InputTransactionsColumns } from '../../components/elements/columns/InputTransactionsColumns';
import { UserSettings } from '../../components/services/data/getUserData';
import {
  getTableDataBasicInputInvested,
  getTableDataBasicInputInvestedInitialState,
  getTableDataBasicInputInvestedReducer,
} from '../../components/services/data/getTableDataBasic/inputInvested';
import {
  getTableDataBasicInputTransactions,
  getTableDataBasicInputTransactionsInitialState,
  getTableDataBasicInputTransactionsReducer,
} from '../../components/services/data/getTableDataBasic/inputTransactions';
const { Search } = Input;
const { Title } = Typography;

export default function Home({ userSettings }: { userSettings: UserSettings }) {
  const [InputTransactionsData, InputTransactionsDataDispatcher] = useReducer(
    getTableDataBasicInputTransactionsReducer,
    getTableDataBasicInputTransactionsInitialState({ isLoading: true })
  );
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState<any>();
  const [InputInvestedData, InputInvestedDataDispatcher] = useReducer(
    getTableDataBasicInputInvestedReducer,
    getTableDataBasicInputInvestedInitialState({ isLoading: true })
  );
  const [InputInvestedSearchText, setInputInvestedSearchText] =
    useState<any>(undefined);

  // columns

  useEffect(() => {
    const abortController = new AbortController();

    getTableDataBasicInputTransactions({
      body: {
        containerName: 'input_transactions',
      },
      abortController,
      dispatcher: InputTransactionsDataDispatcher,
    });

    getTableDataBasicInputInvested({
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
    if (container === 'input_invested') {
      getTableDataBasicInputInvested({
        body: {
          containerName: container,
        },
        abortController: new AbortController(),
        dispatcher: InputInvestedDataDispatcher,
        overWrite: true,
      });
    }
    if (container === 'input_transactions') {
      getTableDataBasicInputTransactions({
        body: {
          containerName: container,
        },
        abortController: new AbortController(),
        dispatcher: InputTransactionsDataDispatcher,
        overWrite: true,
      });
    }
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
        columns={InputTransactionsColumns(
          deleteData,
          () => overWriteTableData('input_transactions'),
          userSettings.currency
        )}
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
                currency={userSettings.currency}
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
        columns={InputInvestedColumns(userSettings.currency, deleteData, () =>
          overWriteTableData('input_invested')
        )}
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
                currency={userSettings.currency}
                parentCallback={() => overWriteTableData('input_invested')}
              />
            </div>
          </div>
        }
      />
    </>
  );
}
