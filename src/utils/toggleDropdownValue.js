const toggleDropdownValue = (field, value, setter) =>
  setter((state) => {
    const newState = { ...state };

    newState[field] = new Set(newState[field]);

    const set = newState[field];

    set.has(value) ? set.delete(value) : set.add(value);

    return newState;
  });

export default toggleDropdownValue;
