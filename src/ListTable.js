import React, { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import { Col, Row } from "reactstrap";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
function ListTable() {
  const [data, setData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  useEffect(() => {
    Axios.get("http://localhost/api/list.php").then((res) => {
      setData(res.data.data.rows);
      setTableHeaders(res.data.data.headers[0]);
    });
  }, []);

  const { SearchBar } = Search;
  const columns = [
    {
      dataField: "id",
      text: tableHeaders?.id?.title,
      sort: tableHeaders?.id?.sortable,
      searchable: tableHeaders?.id?.searchable,
    },
    {
      dataField: "name",
      text: tableHeaders?.name?.title,
      sort: tableHeaders?.name?.sortable,
      searchable: tableHeaders?.name?.searchable,
    },

    {
      dataField: "message",
      text: tableHeaders?.message?.title,
      sort: tableHeaders?.message?.sortable,
      searchable: tableHeaders?.message?.searchable,
    },
    {
      dataField: "created_at",
      text: tableHeaders?.created_at?.title,
      sort: tableHeaders?.created_at?.sortable,
      searchable: tableHeaders?.created_at?.searchable,
    },
  ];
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
    },
  };
  return (
    <Row>
      <Col>
        <h1 className="mt-5">Table list</h1>
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {(props) => (
            <div>
              <h3>Input something at below input field:</h3>
              <SearchBar {...props.searchProps} />
              <hr />
              <BootstrapTable
                bootstrap4={true}
                {...props.baseProps}
                rowEvents={rowEvents}
              />
            </div>
          )}
        </ToolkitProvider>
        {/* <BootstrapTable keyField="id" data={data} columns={columns} /> */}
      </Col>
    </Row>
  );
}

export default ListTable;
