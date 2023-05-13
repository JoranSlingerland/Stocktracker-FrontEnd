interface InputObject {
  date: string;
  [key: string]: any;
}

interface OutputObject {
  date: string;
  [key: string]: any;
}

interface OutputArrayItem {
  month: string;
  values: OutputObject[];
}

function convertTransactionsArray(
  inputArray: InputObject[]
): OutputArrayItem[] {
  const outputArray: OutputArrayItem[] = [];

  if (!Array.isArray(inputArray)) {
    throw new Error('Input is not an array');
  }

  const groupedByMonth: { [month: string]: OutputObject[] } = inputArray.reduce(
    (acc, obj) => {
      const date = new Date(obj.date);
      const month = date.toLocaleString('en-us', { month: 'long' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(obj);
      return acc;
    },
    {} as { [month: string]: OutputObject[] } // Add index signature
  );

  for (const [month, values] of Object.entries(groupedByMonth)) {
    outputArray.push({ month, values });
  }

  return outputArray;
}

export { convertTransactionsArray };
