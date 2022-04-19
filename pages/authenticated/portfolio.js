import { Divider, Table, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import PieSetup from '../../components/pieSetup';

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
          <TabPane className="max-w-md" tab="Stocks" key="1">
            <PieSetup data={data} />
          </TabPane>
          <TabPane tab="Country" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Currency" key="3">
            Content of Tab Pane 3
          </TabPane>
          <TabPane tab="Exchange" key="4">
            Content of Tab Pane 4
          </TabPane>
          <TabPane tab="Effect Type" key="5">
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
