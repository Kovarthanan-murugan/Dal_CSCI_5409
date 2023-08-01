import React from 'react';

// DataTable component receives 'items' as a prop, which represents the data to be displayed in the table.

const DataTable = ({ items }) => {
  // Check if the 'items' array contains data to determine whether the table should be visible.
  const isTableVisible = items.length > 0;

  // Return the JSX code to render the table.
  return (
    <>
      {/* Render the table only if 'isTableVisible' is true (i.e., there are items to display). */}
      {isTableVisible && (
        <table className="table">
          <thead>
            {/* Table header with two columns: 'Field' and 'Information'. */}
            <tr>
              <th className="table-cell">Field</th>
              <th className="table-cell">Information</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate through each 'item' in the 'items' array and create a table row for each item. */}
            {items.map((item, index) => (
              <tr key={index}>
                {/* Display the 'key' property of the 'item' in the first column. */}
                <td className="table-cell">{item.key}</td>
                {/* Display the 'value' property of the 'item' in the second column. */}
                <td className="table-cell">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DataTable;
