function dataToGetSwitch(
  dataToGet: 'year' | 'month' | 'week' | 'ytd' | 'max'
): { start_date: string; end_date: string } {
  const end_date = new Date();
  let start_date: Date;
  if (dataToGet === 'year') {
    start_date = new Date(end_date.getTime() - 365 * 24 * 60 * 60 * 1000);
  } else if (dataToGet === 'month') {
    start_date = new Date(end_date.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (dataToGet === 'week') {
    start_date = new Date(end_date.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (dataToGet === 'ytd') {
    start_date = new Date(end_date.getFullYear(), 0, 1);
  } else if (dataToGet === 'max') {
    return { start_date: 'max', end_date: 'max' };
  } else {
    throw new Error('unexpected error');
  }

  const start_date_string = start_date.toISOString().slice(0, 10);
  const end_date_string = end_date.toISOString().slice(0, 10);
  return { start_date: start_date_string, end_date: end_date_string };
}

export { dataToGetSwitch };
