import React, { useMemo, Fragment, useState } from "react";
import { Table, Input } from "reactstrap";
import { useTable, useFilters, useSortBy, useGlobalFilter } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function ReactTable({ columns, data, onDragEnd, handleSort }) {
  // Use the state and functions returned from useTable to build your UI
  const [changeState, setChangeState] = useState("ace");
  let count;
  //filter hidden column
  const hiddenColumn = columns.map(
    (column) => column.show === true && column.accessor
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      initialState: {
        hiddenColumns: hiddenColumn,
      },
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );

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
      <Table responsive bordered {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => {
            return (
              <Fragment key={index}>
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    // column.isSorted && setData(rows);
                    // console.log(column.isSorted);

                    return (
                      <th
                        onClick={(e) => {
                          setChangeState((pre) =>
                            pre === "ace" ? "dec" : "ace"
                          );
                          handleSort(
                            rows,
                            column.canSort,
                            column.id,
                            changeState
                          );
                          if (count > 2) {
                            count = 0;
                          }
                          if (changeState === "ace") {
                            column.canSort &&
                              (e.currentTarget.innerText = `${column.Header} 🔼`);
                          } else {
                            column.canSort &&
                              (e.currentTarget.innerHTML = `${column.Header} 🔽`);
                          }
                        }}
                        style={{
                          cursor: column.canSort ? "pointer" : "default",
                        }}>
                        {column.render("Header")}
                        {/* Render the columns filter UI */}
                        {/* Add a sort direction indicator */}
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  {headerGroup.headers.map((column, index) => {
                    return (
                      <th key={index}>
                        {/* Render the columns filter UI */}
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </thead>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => {
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
                {provided.placeholder}
              </tbody>
            );
          }}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}

export default ReactTable;
