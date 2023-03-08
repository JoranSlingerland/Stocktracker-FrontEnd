import { Table, Skeleton, Empty } from 'antd';
import { useState } from 'react';

export default function AntdTable({
  columns,
  data,
  isLoading,
  searchEnabled = true,
  tableProps,
  columnProps,
  searchText,
}) {
  const sorterBy = (key) => (a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  };

  const colDataIndexList = columns.map((col) => col.dataIndex);

  columns = columns.map((col) => {
    const filterProps = {};
    if (searchEnabled) {
      filterProps.filteredValue = searchText;
      filterProps.onFilter = (value, record) => {
        Object.keys(record).forEach((key) => {
          if (!colDataIndexList.includes(key)) {
            delete record[key];
          }
        });

        record = Object.values(record);
        return String(record).toLowerCase().includes(value.toLowerCase());
      };
    }

    return {
      ...col,
      ...columnProps,
      ...filterProps,
      sorter: col.sorter ? sorterBy(col.dataIndex) : false,
    };
  });

  console.log(columns);
  return (
    <Table
      columns={columns}
      dataSource={isLoading ? [] : data}
      locale={{
        emptyText: isLoading ? <Skeleton active={true} /> : <Empty />,
      }}
      pagination={false}
      {...tableProps}
      className='overflow-x-auto'
    />
  );
}
