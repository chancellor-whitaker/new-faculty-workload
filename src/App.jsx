import { AgGridReact } from "ag-grid-react";
import { useState, useMemo } from "react";

import VerticalDndList from "./components/VerticalDndList";
import DropdownButton from "./components/DropdownButton";
import DropdownMenu from "./components/DropdownMenu";
import DropdownItem from "./components/DropdownItem";
import FormCheck from "./components/FormCheck";
import Popover from "./components/Popover";
import useData from "./hooks/useData";

// add total row
//

const filterRowData = (rows, dropdowns) =>
  rows.filter((row) => {
    for (const [field, value] of Object.entries(row)) {
      if (field in dropdowns && !dropdowns[field].has(value)) {
        return false;
      }
    }

    return true;
  });

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

const toggleDropdownValue = (field, value, setter) =>
  setter((state) => {
    const newState = { ...state };

    newState[field] = new Set(newState[field]);

    const set = newState[field];

    set.has(value) ? set.delete(value) : set.add(value);

    return newState;
  });

// const descriptiveFields = [
//   "instructor_department",
//   "instructor_college",
//   "faculty_active_ind",
//   "faculty_category",
//   "instructor_pidm",
//   "faculty_status",
// ].reverse();

// const dropdownFields = new Set(descriptiveFields);

// const orderBy = (list = [], order = []) => {
//   const quantify = (el) =>
//     order.includes(el) ? order.indexOf(el) : Number.MAX_SAFE_INTEGER;

//   return [...list].sort((a, b) => quantify(a) - quantify(b));
// };

// ! try multiple lists (in order to enable grouping & aggregating through dragging)
// ! are we pivoting or grouping on the original version?
// ! what happens if you choose pivot mode on ag grid tool bar?
// ! dropdowns need "all" buttons

export default function App() {
  const rowData = useData("data.json");

  const { initialDropdowns, initialColDefs, fieldValues } = useMemo(() => {
    const fieldValues = !Array.isArray(rowData)
      ? null
      : getFieldValues(rowData);

    const initialColDefs =
      fieldValues === null
        ? null
        : Object.keys(fieldValues).map((field) => ({ field }));

    const initialDropdowns =
      fieldValues === null
        ? null
        : Object.fromEntries(
            Object.entries(fieldValues).map(([field, values]) => [
              field,
              new Set(values),
            ])
          );

    return { initialDropdowns, initialColDefs, fieldValues };
  }, [rowData]);

  const [colDefs, setColDefs] = useState(null);

  if (initialColDefs && !colDefs) setColDefs(initialColDefs);

  const toggleColVisibility = ({ target: { checked, value } }) =>
    setColDefs((state) =>
      state.map((el) => (el.field !== value ? el : { ...el, hide: !checked }))
    );

  const [dropdowns, setDropdowns] = useState(null);

  if (initialDropdowns && !dropdowns) setDropdowns(initialDropdowns);

  const filteredRowData = useMemo(
    () => (rowData && dropdowns ? filterRowData(rowData, dropdowns) : null),
    [rowData, dropdowns]
  );

  const isDropdownItemActive = (field, value) =>
    dropdowns && field in dropdowns && dropdowns[field].has(value);

  // console.log(filteredRowData);

  return (
    <main className="container">
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <VerticalDndList setState={setColDefs} state={colDefs} idKey="field">
          {({ field, hide }) => (
            <>
              <div className="d-flex align-items-center">
                <FormCheck
                  onChange={toggleColVisibility}
                  checked={!hide}
                  value={field}
                ></FormCheck>
                <Popover>
                  <DropdownButton>{field}</DropdownButton>
                  <DropdownMenu>
                    {(fieldValues && field in fieldValues
                      ? fieldValues[field]
                      : []
                    ).map((value) => (
                      <DropdownItem
                        onClick={() =>
                          toggleDropdownValue(field, value, setDropdowns)
                        }
                        active={isDropdownItemActive(field, value)}
                        key={value}
                      >
                        {value}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Popover>
              </div>
            </>
          )}
        </VerticalDndList>
      </div>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div style={{ height: 500 }}>
          <AgGridReact rowData={filteredRowData} columnDefs={colDefs} />
        </div>
      </div>
    </main>
  );
}
