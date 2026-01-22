const groupData = (data = [], groupKeys = []) => {
  const fixArray = (param) => [param].filter((element) => element).flat();

  const rows = fixArray(data);

  const cols = fixArray(groupKeys);

  const tree = { node: {}, rows };

  const nodes = [];

  rows.forEach((row) => {
    let level = tree.node;

    let group = {};

    cols.forEach((col) => {
      const value = row[col];

      group[col] = value;

      if (!(value in level)) {
        level[value] = {
          group: { ...group },
          node: {},
          rows: [],
        };

        nodes.push(level[value]);
      }

      level[value].rows.push(row);

      level = level[value].node;
    });
  });

  return nodes.map(({ node, ...rest }) => rest);
};

export default groupData;
