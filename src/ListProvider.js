import React, { useState, useEffect } from "react";
import AppContext from "./context";
import Axios from "axios";

const ListProvider = ({ children }) => {
  const [rawData, setRawData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost/api/list.php").then((res) => {
      setRawData(res.data.data.rows);
      setTableHeaders(res.data.data.headers[0]);
    });
  }, []);

  const value = {
    rawData,
    setRawData,
    tableHeaders,
    setTableHeaders,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default ListProvider;
