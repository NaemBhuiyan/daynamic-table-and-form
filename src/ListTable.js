import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import Axios from "axios";
import { Button, Col, Row } from "reactstrap";

import ReactTable from "./ReactTable";
import { Link } from "react-router-dom";

function ListTable() {
  const [data, setData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost/api/list.php").then((res) => {
      setData(res.data.data.rows);
      setTableHeaders(res.data.data.headers[0]);
    });
  }, []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(data, result.source.index, result.destination.index);
    Axios.post("http://localhost/api/reorder.php", {
      ...items,
    }).then((res) => {
      console.log(res);
    });
    setData(items);
  };
  // console.log(tableHeaders);
  const columnData = Object.entries(tableHeaders).map((column) => {
    return {
      Header: column[1].title,
      accessor: column[0],
      disableSortBy: !column[1].sortable,
      disableFilters: !column[1].searchable,
      show: column[1].hidden,
    };
  });
  const columns = useMemo(
    () => [
      ...columnData,
      {
        Header: "Update",
        Cell: ({ row }) => {
          return (
            <Link
              to={`update-form/${row.original.id}`}
              className="btn btn-primary">
              Update
            </Link>
          );
        },
      },
    ],
    [tableHeaders]
  );
  return (
    <Row>
      <Col>
        <h1 className="mt-5">Table list</h1>
        <ReactTable
          columns={columns}
          data={data}
          onDragEnd={onDragEnd}
          setData={setData}
        />
      </Col>
    </Row>
  );
}

export default ListTable;
