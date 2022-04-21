import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';

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
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        sortable
        filter
      />
    );
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
