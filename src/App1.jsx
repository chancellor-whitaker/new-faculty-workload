import {
  nDistinct as distinct,
  mean as avg,
  n as count,
  summarize,
  tidy,
  sum,
  max,
  min,
} from "@tidyjs/tidy";
import { AgGridReact } from "ag-grid-react";
import { Str } from "@supercharge/strings";
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

const toTitleCase = (key) => Str(key).title().words().join(" ");

// identify what has been filtered (hidden by list)

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

// * don't need first & last
// * want count & count distinct
// * make drag n drop blocks similar to ag grid design
// * total row
// clean up
// re-include filters
// how to receive default dropdowns (test with 1 college first)
// default view
// color coded columns (talk to bethany)

const autoSizeFn = (e) => {
  const colDefs = e.api.getColumnDefs();
  if (e.type === "gridSizeChanged") {
    if (e.clientWidth / colDefs.length > 150) {
      e.api.sizeColumnsToFit();
    } else {
      e.api.autoSizeAllColumns();
    }
  } else {
    e.api.sizeColumnsToFit();
  }
};

const agg2Tidy = {
  distinct,
  count,
  sum,
  max,
  min,
  avg,
};

const findParentheses = (str) => {
  return str.match(/\((.*)\)/).pop();
};

export default function App() {
  const rowData = useData("data.json");

  const { initialDropdowns, initialColDefs, fieldValues, headerNames } =
    useMemo(() => {
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

      const headerNames =
        fieldValues === null
          ? null
          : Object.fromEntries(
              Object.keys(fieldValues).map((field) => [
                field,
                toTitleCase(field),
              ])
            );

      return { initialDropdowns, initialColDefs, fieldValues, headerNames };
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

  // ? fix this
  const { pinnedTopRowData, groupedData } = useMemo(() => {
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

      const everyGroupedRow = groups.map(({ rows }) => rows).flat();

      const handleAgg = ({ group, rows }) => {
        return {
          ...group,
          ...tidy(
            rows,
            summarize(
              Object.fromEntries(
                dndState.values
                  .map(({ aggFunction = ["sum"], field }) =>
                    aggFunction.map((name) => [
                      `${name}(${field})`,
                      agg2Tidy[name](field),
                    ])
                  )
                  .flat()
              )
            )
          )[0],
        };
      };

      return {
        pinnedTopRowData: [handleAgg({ rows: everyGroupedRow })],
        groupedData: groups.map(handleAgg),
      };
    }

    return { pinnedTopRowData: null, groupedData: null };
  }, [filteredRowData, dndState]);

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

  const getHeaderName = (field) =>
    headerNames && field in headerNames ? headerNames[field] : field;

  const gridColDefs = [
    ...new Set([gridData].filter(Boolean).flat().map(Object.keys).flat()),
  ].map((field) => ({ field }));

  const updateAggFunction = (listId, field, agg) =>
    setDndState((state) =>
      Object.fromEntries(
        Object.entries(state).map((entry) =>
          entry[0] !== listId
            ? entry
            : [
                entry[0],
                entry[1].map((el) =>
                  el.field !== field
                    ? el
                    : {
                        ...el,
                        aggFunction: el.aggFunction.includes(agg)
                          ? el.aggFunction.filter((name) => name !== agg)
                          : [...el.aggFunction, agg],
                      }
                ),
              ]
        )
      )
    );

  if (dndState && dndState.values.some((obj) => !("aggFunction" in obj))) {
    setDndState((state) => ({
      ...state,
      values: state.values.map((obj) =>
        !("aggFunction" in obj) ? { ...obj, aggFunction: ["sum"] } : obj
      ),
    }));
  }

  const headerValueGetter = ({ colDef: { field } }) => {
    if (headerNames && field in headerNames) {
      return headerNames[field];
    }

    if (findParentheses(field)) {
      return field.replace(
        findParentheses(field),
        headerNames[findParentheses(field)]
      );
    }

    return field;
  };

  return (
    <main className="container">
      <SubContainer>
        <MultipleDndLists
          setState={setDndState}
          itemContentKey="field"
          itemIdKey="field"
          state={dndState}
        >
          {({ aggFunction = ["sum"], field, hide }, listId) => (
            <>
              {listId === "values" ? (
                <Popover>
                  <span>{getHeaderName(field)}</span>
                  <DropdownMenu>
                    {Object.keys(agg2Tidy).map((agg) => (
                      <DropdownItem
                        onClick={() => updateAggFunction(listId, field, agg)}
                        active={aggFunction.includes(agg)}
                        key={agg}
                      >
                        {agg}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Popover>
              ) : (
                getHeaderName(field)
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
          <AgGridReact
            defaultColDef={{
              headerValueGetter,
            }}
            autoSizeStrategy={{ type: "fitCellContents" }}
            pinnedTopRowData={pinnedTopRowData}
            onGridSizeChanged={autoSizeFn}
            onRowDataUpdated={autoSizeFn}
            columnDefs={gridColDefs}
            rowData={gridData}
          />
        </div>
      </SubContainer>
    </main>
  );
}
