import Overviewbar from '../../components/Overviewbar';
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { withRouter } from 'next/router';
import BasicLineGraph from '../../components/BasicLineGraph';
import PrimeFaceTable from '../../components/PrimeFaceTable';

const Tabs = ({ router }) => {
  const {
    query: { tab },
  } = router;
  const isTabOne = tab === '1' || tab == null;
  const isTabTwo = tab === '2';
  const isTabThree = tab === '3';
  const isTabFour = tab === '4';

  const [valueGrowthData, setvalueGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `/api/get_linechart_data/invested_and_value`
      );
      const valueGrowthData = await response.json();
      setvalueGrowthData(valueGrowthData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const valueGrowthColumns = [
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Profit / Loss',
      field: 'total_pl',
    },
    {
      header: 'Percentage',
      field: 'total_pl_percentage',
    },
  ];
      

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
      {/* Title */}
      <div>
        <div className="flex px-5 py-2 text-2xl">
          <h1>Performance</h1>
        </div>
        <div>
          <Overviewbar />
        </div>
      </div>
      <div>
        <div>
          {isTabOne && (
            <React.Fragment>
              <div>
                <BasicLineGraph data={valueGrowthData} isloading={loading} />
                <Divider />
                <PrimeFaceTable
                  loading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                />
              </div>
            </React.Fragment>
          )}
          {isTabTwo && <React.Fragment>This is tab two content</React.Fragment>}
          {isTabThree && (
            <React.Fragment>This is tab three content</React.Fragment>
          )}
          {isTabFour && (
            <React.Fragment>This is tab four content</React.Fragment>
          )}
        </div>
      </div>
      {/* Content */}
    </div>
  );
};

export default withRouter(Tabs);
