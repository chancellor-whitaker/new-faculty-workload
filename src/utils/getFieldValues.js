const getFieldValues = (data) => {
  const store = {};

  const rows = [data].filter(Boolean).flat();

  rows.forEach((row) =>
    Object.entries(row).forEach(([field, value]) => {
      if (!(field in store)) store[field] = new Set();

      store[field].add(value);
    })
  );

  return Object.fromEntries(
    Object.entries(store).map(([field, set]) => [field, [...set].sort()])
  );
};

export default getFieldValues;
