import { Divider, Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '40%',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* Titel */}
      <div>
        <h1 className="flex items-center justify-center p-5 text-3xl py">
          Actions
        </h1>
      </div>
      <Divider plain></Divider>
      {/* Content */}
      <div>
        {/* stock transactions */}
        <div>
          {/* Header */}
          <div>
            <h2 className="flex items-center justify-start px-3 text-3xl py">
              Stock Transactions
            </h2>
          </div>
          {/* Table */}
          <div>
            <div>
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </div>
        <Divider plain></Divider>
        {/* invested transactions */}
        <div>
          {/* Header */}
          <div>
            <h2 className="flex items-center justify-start px-3 pt-3 text-3xl py">
              Money Transactions
            </h2>
          </div>
          {/* Table */}
          <div>
            <div>
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
