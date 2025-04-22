import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { bitable, IAttachmentField } from "@lark-base-open/js-sdk";
import { Alert, AlertProps, Divider } from "antd";
import useTableDataStore from "./stores/tableData";
import styled from "styled-components";
import ViewSelect from "./Components/ViewSelect";
import GetFieldMetaListButton from "./Components/GetFieldMetaListButton";
import FieldSelect from "./Components/FieldSelect";
import QueryRecordsButton from "./Components/QueryRecordsButton";
import RecordsInfoNotification from "./Components/RecordsInfoNotification";
import IntoDBMethodSelect from "./Components/IntoDBMethodSelect";
import AllInButton from "./Components/AllInButton";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LoadApp />
  </React.StrictMode>
);

const Container = styled.div``;
function LoadApp() {
  const [info, setInfo] = useState("get table name, please waiting ....");
  const [alertType, setAlertType] = useState<AlertProps["type"]>("info");
  const { setTable, setViewMetaList, view } = useTableDataStore();

  const initData = async () => {
    const table = await bitable.base.getActiveTable();
    const tableName = await table.getName();
    const viewMetaList = await table.getViewMetaList();
    console.log(viewMetaList);

    setTable(table);
    setViewMetaList(viewMetaList);

    setInfo(`当前数据表是： ${tableName}`);
    setAlertType("success");
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <Container>
      <Alert message={info} type={alertType} />
      <ViewSelect />
      <GetFieldMetaListButton />
      <FieldSelect />
      <QueryRecordsButton />
      <RecordsInfoNotification />
      <IntoDBMethodSelect />
      <AllInButton/>
    </Container>
  );
}
