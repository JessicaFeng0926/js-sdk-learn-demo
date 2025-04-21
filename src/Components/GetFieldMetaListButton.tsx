import { Button } from "antd";
import React, { useState } from "react";
import useTableDataStore from "../stores/tableData";
import styled from "styled-components";
import { useCustomNotification } from "../hooks/useCustomNotification";
import { validateFields } from "../utils/funcs";
import { IFieldMeta } from "@lark-base-open/js-sdk";

const Container = styled.div``;

const GetFieldMetaListButton = () => {
  const {table, view, setFieldNameMetaMap, setFieldsToSave, setFieldOptions, setResponseFieldsToSave, setLabelFieldsToSave } =
    useTableDataStore();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useCustomNotification();

  const handleGetFieldMetaList = async () => {
    setLoading(true);
    if (!view.id) {
      openNotification("没有选择视图，无法获取字段列表", "error");
      setLoading(false);
    }
    
    const recordList = await view.getVisibleRecordIdList();
    
    console.log("记录数", recordList.length);

    const list = await view.getFieldMetaList();
    console.log("field", list);
    const {
      success,
      message,
      checkedFields,
      responseFields,
      labelFields,
      options,
    } = validateFields(list);
    if (!success) {
      openNotification(message, "error");
      setLoading(false);
      return;
    }

    const tempMap: Record<string, IFieldMeta> = {};
    list.forEach((meta)=>{
        tempMap[meta.name] = meta;
    })

    const fieldId = tempMap["start_time"].id;
    const field = await table.getField(fieldId);
    if(recordList[0]){
        const cell = await field.getCellString(recordList[0]);
        console.log(cell);
    }
    

    setFieldNameMetaMap(tempMap);
    setFieldOptions(options);
    setFieldsToSave(checkedFields);
    setResponseFieldsToSave(responseFields);
    setLabelFieldsToSave(labelFields);
    setLoading(false);
  };

  return (
    <Container>
      {contextHolder}
      <Button onClick={handleGetFieldMetaList} loading={loading}>
        获取当前视图的字段列表
      </Button>
    </Container>
  );
};

export default GetFieldMetaListButton;
