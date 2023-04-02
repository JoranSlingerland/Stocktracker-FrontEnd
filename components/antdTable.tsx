import { Table, Skeleton, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
}: {
  columns: ColumnsType;
  data: any;
  isLoading: boolean;
  caption?: JSX.Element;
  searchEnabled?: boolean;
  tableProps?: any;
  columnProps?: any;
  searchText?: string;
  globalSorter?: boolean;
}): JSX.Element {
  const sorterBy = (key: string) => (a: any, b: any) => {
    const keyList = key.split('.');
    keyList.forEach((key) => {
      a = a[key];
      b = b[key];
    });

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  const colDataIndexList = columns.map((col: any) => col.dataIndex);

  columns = columns.map((col: any) => {
    const filterProps: any = {};
    if (searchEnabled) {
      filterProps.filteredValue = searchText;
      filterProps.onFilter = (value: any, record: any) => {
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
