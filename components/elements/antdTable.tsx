import { Table, Skeleton, Empty, TableColumnProps } from 'antd';
import type { ColumnType, TableProps } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';

export default function AntdTable<T>({
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
  columns: ColumnType<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  caption?: JSX.Element;
  searchEnabled?: boolean;
  tableProps?: TableProps<any>;
  columnProps?: TableColumnProps<T>;
  searchText?: string[];
  globalSorter?: boolean;
}): JSX.Element {
  const sorterBy = (key: Key | undefined) => (a: any, b: any) => {
    if (!key) return 0;
    if (typeof key === 'number') {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
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
    const filterProps: any = {};
    if (searchEnabled) {
      filterProps.filteredValue = searchText;
      filterProps.onFilter = (value: string, record: T) => {
        // deep copy record
        let searchRecord = JSON.parse(JSON.stringify(record));
        Object.keys(searchRecord).forEach((key) => {
          if (!colDataIndexList.includes(key)) {
            delete searchRecord[key];
          }
        });

        searchRecord = Object.values(searchRecord);
        return String(searchRecord).toLowerCase().includes(value.toLowerCase());
      };
    }
    if (globalSorter) {
      col.sorter = col.sorter === undefined || col.sorter === true;
    } else {
      col.sorter = col.sorter === true;
    }

    return {
      ...col,
      ...columnProps,
      ...filterProps,
      sorter: col.sorter && sorterBy(col.key),
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
