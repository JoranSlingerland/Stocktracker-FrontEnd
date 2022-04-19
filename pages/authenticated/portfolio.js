import { Divider, Table, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import PieChart from '../../components/PieChart';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const SingleDaycolumns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
  },
  {
    title: 'Average Cost',
    dataIndex: 'average_cost',
  },
  {
    title: 'Total Cost',
    dataIndex: 'total_cost',
  },
  {
    title: 'Total Value',
    dataIndex: 'total_value',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Transaction Cost',
    dataIndex: 'transaction_cost',
  },
  {
    title: 'Close Value',
    dataIndex: 'close_value',
  },
];

const data = [
  {
    type: 'AMD',
    value: 27,
  },
  {
    type: 'Apple',
    value: 25,
  },
];

export default function Home() {
  // get table data
  const [SingleDayData, setSingleDayData] = useState(null);
  const [SingleDayDataisLoading, setSingleDayDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_table_data/single_day`);
      const SingleDayData = await response.json();
      setSingleDayData(SingleDayData);
      setSingleDayDataisLoading(false);
    }
    fetchData();
  }, []);

  // Get stock pie chart data
  const [StockPieData, setStockPieData] = useState([
    { type: 'loading', value: 100 },
  ]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_pie_data/stocks`);
      const StockPieData = await response.json();
      setStockPieData(StockPieData);
    }
    fetchData();
  }, []);

  // Get currency pie chart data
  const [CurrencyPieData, setCurrencyPieData] = useState([
    { type: 'loading', value: 100 },
  ]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_pie_data/currency`);
      const CurrencyPieData = await response.json();
      setCurrencyPieData(CurrencyPieData);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Titel */}
      <div>
        <h1 className="flex items-center justify-center p-5 text-3xl py">
          Actions
        </h1>
      </div>
      <Divider plain></Divider>
      {/* Tabs */}
      <div className="w-full card-container">
        <Tabs type="card" defaultActiveKey="1" onChange={callback}>
          <TabPane className="max-w-2xl" tab="Stocks" key="1">
            <PieChart data={StockPieData} />
          </TabPane>
          <TabPane className="max-w-2xl" tab="Country" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane className="max-w-2xl" tab="Currency" key="3">
            <PieChart data={CurrencyPieData} />
          </TabPane>
          <TabPane className="max-w-2xl" tab="Exchange" key="4">
            Content of Tab Pane 4
          </TabPane>
          <TabPane className="max-w-2xl" tab="Effect Type" key="5">
            Content of Tab Pane 5
          </TabPane>
        </Tabs>
      </div>
      <Divider plain></Divider>
      {/* Table */}
      <div className="w-full">
        <Table
          loading={SingleDayDataisLoading}
          columns={SingleDaycolumns}
          dataSource={SingleDayData}
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
}
