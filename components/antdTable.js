import { Table, Skeleton, Empty } from 'antd';

export default function AntdTable({
  columns,
  data,
  isLoading,
  caption,
  searchEnabled,
  tableProps,
  columnProps,
  searchText,
  globalSorter,
}) {
  const sorterBy = (key) => (a, b) => {
    const keyList = key.split('.');
    keyList.forEach((key) => {
      a = a[key];
      b = b[key];
    });

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  const colDataIndexList = columns.map((col) => col.dataIndex);

  columns = columns.map((col) => {
    const filterProps = {};
    if (searchEnabled) {
      filterProps.filteredValue = searchText;
      filterProps.onFilter = (value, record) => {
        // deep copy record
        let searchrecord = JSON.parse(JSON.stringify(record));
        Object.keys(searchrecord).forEach((key) => {
          if (!colDataIndexList.includes(key)) {
            delete searchrecord[key];
          }
        });

        searchrecord = Object.values(searchrecord);
        return String(searchrecord).toLowerCase().includes(value.toLowerCase());
      };
    }

    return {
      ...col,
      ...columnProps,
      ...filterProps,
      sorter: col.sorter || globalSorter ? sorterBy(col.key) : false,
      showSorterTooltip: false,
    };
  });

  return (
    <Table
      columns={columns}
      dataSource={isLoading ? [] : data}
      locale={{
        emptyText: isLoading ? <Skeleton active={true} /> : <Empty />,
      }}
      pagination={false}
      caption={caption}
      {...tableProps}
      className="overflow-x-auto"
    />
  );
}
