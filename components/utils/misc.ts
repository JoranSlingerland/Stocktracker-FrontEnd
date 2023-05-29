import { InputTransactionData } from '../types/types';
import { inputTransactionData } from '../constants/placeholders';

function convertTransactionsArray(
  inputArray: InputTransactionData[] | undefined
): { month: string; values: InputTransactionData[] }[] {
  const outputArray: { month: string; values: InputTransactionData[] }[] = [];

  if (!inputArray) {
    return [
      {
        month: '',
        values: [inputTransactionData],
      },
    ];
  }

  if (!Array.isArray(inputArray)) {
    throw new Error('Input is not an array');
  }

  if (inputArray.length === 0) {
    return [
      {
        month: '',
        values: [inputTransactionData],
      },
    ];
  }

  const groupedByMonth: { [month: string]: InputTransactionData[] } =
    inputArray.reduce(
      (acc, obj) => {
        const date = new Date(obj.date);
        const month = date.toLocaleString('en-us', { month: 'long' });
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(obj);
        return acc;
      },
      {} as { [month: string]: InputTransactionData[] } // Add index signature
    );

  for (const [month, values] of Object.entries(groupedByMonth)) {
    outputArray.push({ month, values });
  }

  return outputArray;
}

export { convertTransactionsArray };
