import React from "react";
import "./App.css";
import { Table, Input } from "reactstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Input
      className="mb-4"
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`${count} records search here`}
    />
  );
}

function ReactTable({ columns, data, onDragEnd }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );
  // a little function to help us with reordering the result

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
  });
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "#fff",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  // Render the UI for  table
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Table responsive bordered {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                // column.isSorted && setData(rows);
                return (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}

                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => {
            // console.log(rows);
            return (
              <tbody
                {...getTableBodyProps()}
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Draggable key={i} draggableId={row.id} index={i}>
                      {(provided, snapshot) => (
                        <tr
                          {...row.getRowProps()}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>
                          {row.cells.map((cell) => {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
              </tbody>
            );
          }}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}

export default ReactTable;
