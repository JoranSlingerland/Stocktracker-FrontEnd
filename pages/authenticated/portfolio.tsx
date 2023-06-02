import { Tabs, Collapse, Typography } from 'antd';
import PieChart from '../../components/elements/PieChart';
import AntdTable from '../../components/elements/antdTable';
import useSessionStorageState from '../../components/hooks/useSessionStorageState';
import { RealizedColumns } from '../../components/elements/columns/RealizedColumns';
import { UnRealizedColumns } from '../../components/elements/columns/UnRealizedColumns';
import { usePieData } from '../../components/services/chart/pie';
import { UseUserData } from '../../components/services/user/get';
import { useTableDataBasicStocksHeld } from '../../components/services/table/basic/stocksHeld';

const { Title } = Typography;
const { Panel } = Collapse;

export default function Home({ userSettings }: { userSettings: UseUserData }) {
  // Const setup
  const [tab, setTab] = useSessionStorageState('portfolioTab', '1');
  const [CollapseKey, setCollapseKey] = useSessionStorageState(
    'portfolioCollapse',
    '0'
  );
  const { data: realizedData, isLoading: realizedIsLoading } =
    useTableDataBasicStocksHeld({
      query: {
        fullyRealized: true,
        partialRealized: true,
        andOr: 'or',
        containerName: 'stocks_held',
      },
      enabled: CollapseKey === '1',
    });
  const { data: unRealizedData, isLoading: unRealizedIsLoading } =
    useTableDataBasicStocksHeld({
      query: {
        fullyRealized: false,
        containerName: 'stocks_held',
      },
      enabled: true,
    });
  const { data: stockPieData, isLoading: stockPieIsLoading } = usePieData({
    query: {
      dataType: 'stocks',
    },
    enabled: tab === '1',
  });
  const { data: sectorPieData, isLoading: sectorPieIsLoading } = usePieData({
    query: {
      dataType: 'sector',
    },
    enabled: tab === '2',
  });
  const { data: countryPieData, isLoading: countryPieIsLoading } = usePieData({
    query: {
      dataType: 'country',
    },
    enabled: tab === '3',
  });
  const { data: currencyPieData, isLoading: currencyPieIsLoading } = usePieData(
    {
      query: {
        dataType: 'currency',
      },
      enabled: tab === '4',
    }
  );

  // Tabs setup
  const items = [
    {
      key: '1',
      label: 'Stocks',
      children: (
        <div className="min-h-96">
          <PieChart
            data={stockPieData}
            isLoading={stockPieIsLoading}
            currency={userSettings.data.currency}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Sector',
      children: (
        <div className="min-h-96">
          <PieChart
            data={sectorPieData}
            isLoading={sectorPieIsLoading}
            currency={userSettings.data.currency}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Country',
      children: (
        <div className="min-h-96">
          <PieChart
            data={countryPieData}
            isLoading={countryPieIsLoading}
            currency={userSettings.data.currency}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Currency',
      children: (
        <div className="min-h-96">
          <PieChart
            data={currencyPieData}
            isLoading={currencyPieIsLoading}
            currency={userSettings.data.currency}
          />
        </div>
      ),
    },
  ];

  // Render
  return (
    <>
      <Title className="flex items-center justify-center pt-5" level={1}>
        Portfolio
      </Title>
      <Tabs
        type="line"
        activeKey={tab}
        onChange={(activeKey) => {
          setTab(activeKey);
        }}
        items={items}
      />
      <AntdTable
        columns={UnRealizedColumns(userSettings.data.currency)}
        data={unRealizedData}
        isLoading={unRealizedIsLoading}
        globalSorter={true}
        tableProps={{
          scroll: {
            x: true,
          },
        }}
      />
      <Collapse
        activeKey={CollapseKey}
        onChange={() => {
          setCollapseKey(CollapseKey === '1' ? '0' : '1');
        }}
        bordered={false}
        ghost
      >
        <Panel className="p-0" header="Realized Stocks" key="1">
          <AntdTable
            columns={RealizedColumns(userSettings.data.currency)}
            data={realizedData}
            isLoading={realizedIsLoading}
            globalSorter={true}
            tableProps={{
              scroll: {
                x: true,
              },
            }}
          />
        </Panel>
      </Collapse>
    </>
  );
}
