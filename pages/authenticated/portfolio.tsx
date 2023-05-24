import { Tabs, Collapse, Typography } from 'antd';
import PieChart from '../../components/elements/PrimeFacePieChart';
import AntdTable from '../../components/elements/antdTable';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import { RealizedColumns } from '../../components/elements/columns/RealizedColumns';
import { UnRealizedColumns } from '../../components/elements/columns/UnRealizedColumns';
import { usePieData } from '../../components/services/data/getPieData';
import { UserSettings } from '../../components/services/data/getUserData';
import { useTableDataBasicStocksHeld } from '../../components/services/data/getTableDataBasic/stocksHeld';

const { Title } = Typography;
const { Panel } = Collapse;

export default function Home({ userSettings }: { userSettings: UserSettings }) {
  // Const setup
  const [tab, setTab] = useLocalStorageState('portfolioTab', '1');
  const [CollapseKey, setCollapseKey] = useLocalStorageState(
    'portfolioCollapse',
    '0'
  );
  const { data: realizedData, isLoading: realizedIsLoading } =
    useTableDataBasicStocksHeld({
      body: {
        fullyRealized: true,
        partialRealized: true,
        andOr: 'or',
        containerName: 'stocks_held',
      },
      enabled: CollapseKey === '1',
    });
  const { data: unRealizedData, isLoading: unRealizedIsLoading } =
    useTableDataBasicStocksHeld({
      body: {
        fullyRealized: false,
        containerName: 'stocks_held',
      },
      enabled: true,
    });

  const { data: stockPieData, isLoading: stockPieIsLoading } = usePieData({
    body: {
      dataType: 'stocks',
    },
    enabled: tab === '1',
  });
  const { data: sectorPieData, isLoading: sectorPieIsLoading } = usePieData({
    body: {
      dataType: 'sector',
    },
    enabled: tab === '2',
  });
  const { data: countryPieData, isLoading: countryPieIsLoading } = usePieData({
    body: {
      dataType: 'country',
    },
    enabled: tab === '3',
  });
  const { data: currencyPieData, isLoading: currencyPieIsLoading } = usePieData(
    {
      body: {
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
            isloading={stockPieIsLoading}
            userSettings={userSettings}
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
            isloading={sectorPieIsLoading}
            userSettings={userSettings}
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
            isloading={countryPieIsLoading}
            userSettings={userSettings}
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
            isloading={currencyPieIsLoading}
            userSettings={userSettings}
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
        columns={UnRealizedColumns(userSettings.currency)}
        data={unRealizedData}
        isLoading={unRealizedIsLoading}
        globalSorter={true}
        tableProps={{
          scroll: true,
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
            columns={RealizedColumns(userSettings.currency)}
            data={realizedData}
            isLoading={realizedIsLoading}
            globalSorter={true}
            tableProps={{
              scroll: true,
            }}
          />
        </Panel>
      </Collapse>
    </>
  );
}
