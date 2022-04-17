import { useEffect } from 'react';

function DynamicTable({ TableData }) {
  // get table column
  const column = Object.keys(TableData[0]);
  // get table heading data
  const ThData = () => {
    return column.map((data) => {
      return (
        <th
          className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
          key={data}
        >
          {data}
        </th>
      );
    });
  };
  // get table row data
  const tdData = () => {
    return TableData.map((data) => {
      return (
        <tr>
          {column.map((v) => {
            return (
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {data[v]}
              </td>
            );
          })}
        </tr>
      );
    });
  };
  return (
    <table className="min-w-full">
      <thead>
        <tr>{ThData()}</tr>
      </thead>
      <tbody className="bg-white">{tdData()}</tbody>
    </table>
  );
}
export default DynamicTable;
