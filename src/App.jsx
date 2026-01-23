import {
  mean as avg,
  n as count,
  summarize,
  first,
  tidy,
  last,
  sum,
  max,
  min,
} from "@tidyjs/tidy";
import { AgGridReact } from "ag-grid-react";
import { useState, useMemo } from "react";

import toggleDropdownValue from "./utils/toggleDropdownValue";
import MultipleDndLists from "./components/MultipleDndLists";
import DropdownButton from "./components/DropdownButton";
import SubContainer from "./components/SubContainer";
import DropdownMenu from "./components/DropdownMenu";
import DropdownItem from "./components/DropdownItem";
import getFieldValues from "./utils/getFieldValues";
import filterRowData from "./utils/filterRowData";
import FormCheck from "./components/FormCheck";
import Popover from "./components/Popover";
import groupData from "./utils/groupData";
import useData from "./hooks/useData";

// add total row
// identify what has been filtered (hidden by list)
// pivoting (similar to ag grid pivot mode col toolbar)

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

// avg, count, first, last, max, min, sum

const agg2Tidy = { first, count, last, sum, max, min, avg };

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

  const [dropdowns, setDropdowns] = useState(null);

  if (initialDropdowns && !dropdowns) setDropdowns(initialDropdowns);

  const filteredRowData = useMemo(
    () => (rowData && dropdowns ? filterRowData(rowData, dropdowns) : null),
    [rowData, dropdowns]
  );

  const isDropdownItemActive = (field, value) =>
    dropdowns && field in dropdowns && dropdowns[field].has(value);

  const [dndState, setDndState] = useState(null);

  if (initialColDefs && !dndState) {
    setDndState({ columns: initialColDefs, rowGroups: [], values: [] });
  }

  const colDefs = !dndState
    ? null
    : dndState.rowGroups.length > 0
    ? [...dndState.rowGroups, ...dndState.values]
    : dndState.columns;

  const groupedData = useMemo(() => {
    if (dndState) {
      const rowGroups = dndState.rowGroups.map(({ field }) => field);

      const groups = groupData(filteredRowData, rowGroups).filter(
        ({ depth }) => depth === rowGroups.length
      );

      /*
      tidy(data, summarize({
  stdev: deviation('value'),
})
  */

      return groups.map(({ group, rows }) => ({
        ...group,
        ...tidy(
          rows,
          summarize(
            Object.fromEntries(
              dndState.values.map(({ aggFunction = "sum", field }) => [
                field,
                agg2Tidy[aggFunction](field),
              ])
            )
          )
        )[0],
      }));
    }

    return null;
  }, [filteredRowData, dndState]);

  console.log(groupedData);

  const toggleColVisibility = ({ target: { checked, value, name } }) =>
    setDndState((state) =>
      Object.fromEntries(
        Object.entries(state).map((entry) =>
          entry[0] !== name
            ? entry
            : [
                entry[0],
                entry[1].map((el) =>
                  el.field !== value ? el : { ...el, hide: !checked }
                ),
              ]
        )
      )
    );

  const gridData =
    dndState && dndState.rowGroups.length > 0 ? groupedData : filteredRowData;

  const updateAggFunction = (listId, field, aggFunction) =>
    setDndState((state) =>
      Object.fromEntries(
        Object.entries(state).map((entry) =>
          entry[0] !== listId
            ? entry
            : [
                entry[0],
                entry[1].map((el) =>
                  el.field !== field ? el : { ...el, aggFunction }
                ),
              ]
        )
      )
    );

  return (
    <main className="container">
      <SubContainer>
        <MultipleDndLists
          setState={setDndState}
          itemContentKey="field"
          itemIdKey="field"
          state={dndState}
        >
          {({ aggFunction = "sum", field, hide }, listId) => (
            <>
              {listId === "values" ? (
                <Popover>
                  <span>{`${aggFunction}(${field})`}</span>
                  <DropdownMenu>
                    {Object.keys(agg2Tidy).map((agg) => (
                      <DropdownItem
                        onClick={() => updateAggFunction(listId, field, agg)}
                        active={agg === aggFunction}
                        key={agg}
                      >
                        {agg}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Popover>
              ) : (
                field
              )}
            </>
            // <div className="d-flex align-items-center">
            //   <FormCheck
            //     onChange={toggleColVisibility}
            //     checked={!hide}
            //     value={field}
            //     name={listId}
            //   ></FormCheck>
            //   <Popover>
            //     <DropdownButton>{field}</DropdownButton>
            //     <DropdownMenu>
            //       {(fieldValues && field in fieldValues
            //         ? fieldValues[field]
            //         : []
            //       ).map((value) => (
            //         <DropdownItem
            //           onClick={() =>
            //             toggleDropdownValue(field, value, setDropdowns)
            //           }
            //           active={isDropdownItemActive(field, value)}
            //           key={value}
            //         >
            //           {value}
            //         </DropdownItem>
            //       ))}
            //     </DropdownMenu>
            //   </Popover>
            // </div>
          )}
        </MultipleDndLists>
      </SubContainer>
      <SubContainer>
        <div style={{ height: 500 }}>
          <AgGridReact columnDefs={colDefs} rowData={gridData} />
        </div>
      </SubContainer>
    </main>
  );
}
