// components\PrimeFaceTable.js

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import Image from '../components/image';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function PrimeFaceTable({ data, columns, loading }) {
  // Search setup
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1['global'].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue1('');
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
  const formatCurrency = (value, maximumFractionDigits) => {
    if (maximumFractionDigits == undefined) {
      maximumFractionDigits == 2;
    }
    return value.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: maximumFractionDigits,
    });
  };
  const formatPercentage = (value) => {
    return value.toLocaleString('nl-NL', {
      style: 'percent',
      minimumFractionDigits: 2,
    });
  };

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
  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <div style={{ textAlign: 'left' }}>
          <MultiSelect
            value={selectedColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            placeholder="Select Columns"
            fixedPlaceholder="true"
            style={{ width: '20em' }}
          />
        </div>
      </div>
    );
  };
  const header1 = renderHeader1();

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
          filters={filters1}
          filterDisplay="menu"
          header={header1}
          loading={loading}
        >
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
}
