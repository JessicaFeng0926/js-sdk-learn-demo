import { Button } from "antd";
import React, { useState } from "react";
import useTableDataStore from "../stores/tableData";
import styled from "styled-components";
import { useCustomNotification } from "../hooks/useCustomNotification";
import { validateFields } from "../utils/funcs";
import { IFieldMeta } from "@lark-base-open/js-sdk";

const Container = styled.div``;

const QueryRecordsButton = () => {
  const { view, setRecordIds } = useTableDataStore();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useCustomNotification();

  const handleGetVisibleRecords = async () => {
    setLoading(true);
    if (!view.id) {
      openNotification("没有选择视图，无法获取可见记录总数", "error");
      setLoading(false);
    }

    const recordList = await view.getVisibleRecordIdList();
    if (!recordList || recordList.length === 0) {
      openNotification("获取当前视图可见记录总数失败", "error");
      setLoading(false);
      return;
    }

    for (let id of recordList) {
      if (!id) {
        openNotification("获取当前视图可见记录总数失败", "error");
        setLoading(false);
        return;
      }
    }

    setRecordIds(
      recordList.map((id) => {
        return `${id}`;
      })
    );

    setLoading(false);
  };

  return (
    <Container>
      {contextHolder}
      <Button onClick={handleGetVisibleRecords} loading={loading}>
        查询当前视图可见记录总数
      </Button>
    </Container>
  );
};

export default QueryRecordsButton;
