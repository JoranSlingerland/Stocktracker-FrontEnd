import { Divider, Input, Typography } from 'antd';
import { useState } from 'react';
import AntdTable from '../../components/elements/antdTable';
import {
  TransactionsFormModal,
  StockFormModal,
} from '../../components/modules/formModal';
import { deleteInputItems } from '../../components/services/input/delete';
import { InputInvestedColumns } from '../../components/elements/columns/InputInvestedColumns';
import { InputTransactionsColumns } from '../../components/elements/columns/InputTransactionsColumns';
import { UseUserData } from '../../components/services/user/get';
import { useTableDataBasicInputInvested } from '../../components/services/table/basic/inputInvested';
import { useTableDataBasicInputTransactions } from '../../components/services/table/basic/inputTransactions';
const { Search } = Input;
const { Title } = Typography;

export default function Home({ userSettings }: { userSettings: UseUserData }) {
  const {
    data: inputTransactionsData,
    isLoading: inputTransactionsIsloading,
    refetchData: inputTransactionsRefetch,
    overwriteData: inputTransactionsOverwrite,
  } = useTableDataBasicInputTransactions({
    query: {
      containerName: 'input_transactions',
    },
  });
  const {
    data: inputInvestedData,
    isLoading: inputInvestedIsloading,
    refetchData: inputInvestedRefetch,
    overwriteData: inputInvestedOverwrite,
  } = useTableDataBasicInputInvested({
    query: {
      containerName: 'input_invested',
    },
  });
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState<string[]>([]);
  const [InputInvestedSearchText, setInputInvestedSearchText] = useState<
    string[]
  >([]);

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
      if (container === 'input_invested' && inputInvestedData) {
        const newData = inputInvestedData.filter(
          (item) => !id.includes(item.id)
        );
        inputInvestedOverwrite(newData);
        inputInvestedRefetch({ cacheOnly: true });
      } else if (container === 'input_transactions' && inputTransactionsData) {
        const newData = inputTransactionsData.filter(
          (item) => !id.includes(item.id)
        );
        inputTransactionsOverwrite(newData);
        inputTransactionsRefetch({ cacheOnly: true });
      }
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
        isLoading={inputTransactionsIsloading}
        columns={InputTransactionsColumns(
          deleteData,
          () => inputTransactionsRefetch(),
          userSettings.data.currency
        )}
        data={inputTransactionsData}
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
                currency={userSettings.data.currency}
                parentCallback={() => inputTransactionsRefetch()}
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
        isLoading={inputInvestedIsloading}
        columns={InputInvestedColumns(
          userSettings.data.currency,
          deleteData,
          () => inputInvestedRefetch()
        )}
        data={inputInvestedData}
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
                currency={userSettings.data.currency}
                parentCallback={() => inputInvestedRefetch()}
              />
            </div>
          </div>
        }
      />
    </>
  );
}
