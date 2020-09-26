import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import { Col, Row } from "reactstrap";

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
  // console.log(data);
  const handleSort = (rows, canSort, columnHeaderId, state) => {
    if (canSort) {
      const returnData = rows.map((row) => row.original);
      const columnValue = returnData.map((row) => row[columnHeaderId]);
      const ace = [...columnValue.sort()];
      const dec = [...columnValue.sort().reverse()];
      const sortDataDec = dec
        .map((item) => {
          return returnData.filter((redata) => redata[columnHeaderId] === item);
        })
        .flat();
      const sortDataAce = ace
        .map((item) => {
          return returnData.filter((redata) => redata[columnHeaderId] === item);
        })
        .flat();
      if (state === "ace") {
        setData([...new Set(sortDataAce)]);
      } else {
        setData([...new Set(sortDataDec)]);
      }
    }

    // setData(rows.map((id) => id === rows.original));
  };
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
    [columnData]
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
          handleSort={handleSort}
        />
      </Col>
    </Row>
  );
}

export default ListTable;
