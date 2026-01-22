const filterRowData = (rows, dropdowns) =>
  rows.filter((row) => {
    for (const [field, value] of Object.entries(row)) {
      if (field in dropdowns && !dropdowns[field].has(value)) {
        return false;
      }
    }

    return true;
  });

export default filterRowData;
