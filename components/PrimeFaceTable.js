// components\PrimeFaceTable.js

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button, Tooltip, Skeleton, Empty } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { MultiSelect } from 'primereact/multiselect';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import Image from '../utils/image';
import AddXForm from './formModal';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function PrimeFaceTable({
  data,
  columns,
  loading,
  allowAdd = false,
  form = null,
  parentCallback = null,
}) {
  // Search setup
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue('');
  };

  // Column select setup
  const [selectedColumns, setSelectedColumns] = useState(columns);

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };

  // Formating setup
  const currency_template = (rowData, col) => {
    col.field.split('.').forEach((item) => {
      rowData = rowData[item];
    });
    return formatCurrency(rowData);
  };

  const currencyWithColorsTemplate = (rowData, col) => {
    col.field.split('.').forEach((item) => {
      rowData = rowData[item];
    });
    const data = formatCurrency(rowData);
    if (rowData > 0) {
      return <span className="text-green-500">{data}</span>;
    } else if (rowData < 0) {
      return <span className="text-red-500">{data}</span>;
    } else {
      return data;
    }
  };

  const percentageWithColorsTemplate = (rowData, col) => {
    col.field.split('.').forEach((item) => {
      rowData = rowData[item];
    });
    const data = formatPercentage(rowData);
    if (rowData > 0) {
      return <span className="text-green-500">{data}</span>;
    } else if (rowData < 0) {
      return <span className="text-red-500">{data}</span>;
    } else {
      return data;
    }
  };

  const symbolTempalte = (rowData) => {
    if (rowData.meta === undefined) {
      return <div className="flex flex-row">{rowData.symbol}</div>;
    } else {
      return (
        <div className="flex flex-row">
          <Image
            className="pr-1"
            alt="logo"
            src={rowData.meta.logo}
            width={35}
            height={35}
          />
          {rowData.symbol}
        </div>
      );
    }
  };

  const roundToTwoTemplate = (rowData, col) => {
    col.field.split('.').forEach((item) => {
      rowData = rowData[item];
    });
    return Math.round(rowData * 100) / 100;
  };

  // Header setup
  const header = (form) => {
    return (
      <div className="flex">
        <div className="flex w-1/2">
          <div className="container grid w-10 mx-0 place-items-center">
            <Tooltip title="Clear filters">
              <Button
                icon={<FilterOutlined />}
                shape="circle"
                onClick={clearFilter}
              />
            </Tooltip>
          </div>
          <div className="text-left">
            <Tooltip title="Select Columns">
              <MultiSelect
                value={selectedColumns}
                options={columns}
                optionLabel="header"
                onChange={onColumnToggle}
              />
            </Tooltip>
          </div>
        </div>
        {allowAdd && (
          <div className="w-1/2">
            <div className="">
              <AddXForm form={form} parentCallback={parentCallback} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Column setup
  const currencyColumns = [
    'average_cost',
    'unrealized.total_cost',
    'unrealized.cost_per_share',
    'unrealized.total_value',
    'realized.transaction_cost',
    'unrealized.close_value',
    'cost',
    'amount',
    'transaction_cost',
    'realized.total_dividends',
  ];

  const currencyWithColorsColumns = [
    'unrealized.total_pl',
    'realized.total_pl',
  ];

  const percentageWithColorsColumns = [
    'unrealized.total_pl_percentage',
    'realized.total_pl_percentage',
  ];

  const roundToTwoColumns = ['quantity'];

  const columnProps = {
    sortable: true,
    filter: true,
  };

  const dynamicColumns = selectedColumns.map((col, i) => {
    if (currencyColumns.includes(col.field)) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={currency_template}
          {...columnProps}
        />
      );
    } else if (currencyWithColorsColumns.includes(col.field)) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={currencyWithColorsTemplate}
          {...columnProps}
        />
      );
    } else if (percentageWithColorsColumns.includes(col.field)) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={percentageWithColorsTemplate}
          {...columnProps}
        />
      );
    } else if (roundToTwoColumns.includes(col.field)) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={roundToTwoTemplate}
          {...columnProps}
        />
      );
    } else if (col.field === 'symbol') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={symbolTempalte}
          {...columnProps}
        />
      );
    } else {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          {...columnProps}
        />
      );
    }
  });

  const emptyMessage = () => {
    if (loading) {
      return (
        <Skeleton
          active={loading}
          loading={loading}
          title={false}
          paragraph={{ width: '100%' }}
        />
      );
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  };

  return (
    <DataTable
      value={data}
      responsiveLayout="scroll"
      size="small"
      filters={filters}
      filterDisplay="menu"
      header={header(form)}
      emptyMessage={emptyMessage()}
    >
      {dynamicColumns}
    </DataTable>
  );
}
