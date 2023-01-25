// components\PrimeFaceTable.js

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button, Tooltip } from 'antd';
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
  const average_costTemplate = (rowData) => {
    return formatCurrency(rowData.average_cost);
  };

  const total_costTemplate = (rowData) => {
    return formatCurrency(rowData.total_cost);
  };

  const total_valueTemplate = (rowData) => {
    return formatCurrency(rowData.total_value);
  };

  const transaction_costTemplate = (rowData) => {
    return formatCurrency(rowData.transaction_cost);
  };

  const close_valueTemplate = (rowData) => {
    return formatCurrency(rowData.close_value);
  };

  const costTemplate = (rowData) => {
    return formatCurrency(rowData.cost);
  };

  const amountTemplate = (rowData) => {
    return formatCurrency(rowData.amount);
  };
  const total_dividendsTemplate = (rowData) => {
    return formatCurrency(rowData.total_dividends);
  };

  const profitTemplate = (rowData) => {
    const data = formatCurrency(rowData.total_pl);
    if (rowData.total_pl > 0) {
      return <span className="text-green-500">{data}</span>;
    } else if (rowData.total_pl < 0) {
      return <span className="text-red-500">{data}</span>;
    } else {
      return data;
    }
  };
  const profitPercentageTemplate = (rowData) => {
    if (rowData.total_pl_percentage > 0) {
      const data = formatPercentage(rowData.total_pl_percentage);
      return <span className="text-green-500">{data}</span>;
    } else if (rowData.total_pl_percentage < 0) {
      const data = formatPercentage(rowData.total_pl_percentage);
      return <span className="text-red-500">{data}</span>;
    } else {
      const data = formatPercentage(rowData.total_pl_percentage);
      return data;
    }
  };

  const stockNameTemplate = (rowData) => {
    return (
      <div className="flex flex-row">
        <Image
          className="pr-1"
          alt="logo"
          src={rowData.logo}
          width={35}
          height={35}
        />
        {rowData.name}
      </div>
    );
  };

  const symbolTempalte = (rowData) => {
    if (rowData.logo === undefined) {
      return <div className="flex flex-row">{rowData.symbol}</div>;
    } else {
      return (
        <div className="flex flex-row">
          <Image
            className="pr-1"
            alt="logo"
            src={rowData.logo}
            width={35}
            height={35}
          />
          {rowData.symbol}
        </div>
      );
    }
  };

  const quantityTemplate = (rowData) => {
    var quantity = rowData.quantity;
    return Math.round(quantity * 100) / 100;
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

  const dynamicColumns = selectedColumns.map((col, i) => {
    if (col.field === 'average_cost') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={average_costTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'total_cost') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={total_costTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'total_value') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={total_valueTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'transaction_cost') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={transaction_costTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'close_value') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={close_valueTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'cost') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={costTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'amount') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={amountTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'total_pl') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={profitTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'total_pl_percentage') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={profitPercentageTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'quantity') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={quantityTemplate}
          sortable
          filter
        />
      );
    } else if (col.field === 'symbol') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={symbolTempalte}
          sortable
          filter
        />
      );
    } else if (col.field === 'total_dividends') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={total_dividendsTemplate}
          sortable
          filter
        />
      );
    } else {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          sortable
          filter
        />
      );
    }
  });

  return (
    <div>
      <div className="card">
        <DataTable
          value={data}
          responsiveLayout="scroll"
          size="small"
          stripedRows
          filters={filters}
          filterDisplay="menu"
          header={header(form)}
          loading={loading}
        >
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
}
