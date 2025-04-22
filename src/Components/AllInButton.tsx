import { Button } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import {
  formatOneRecord,
  getFieldNameObjMap,
  getPayloadFields,
} from "../utils/funcs";
import useTableDataStore from "../stores/tableData";
import { useCustomNotification } from "../hooks/useCustomNotification";
import { IntoDBMethod } from "../utils/constants";

const Container = styled.div``;

const InfoContainer = styled.div`
  color: gray;
`;

const AllInButton = () => {
  const [loading, setLoading] = useState(false);
  const {
    fieldsToSave,
    responseFieldsToSave,
    labelFieldsToSave,
    fieldNameMetaMap,
    table,
    recordIds,
    intoDBMethod
  } = useTableDataStore();
  const { openNotification, contextHolder } = useCustomNotification();

  const handleAllIn = async () => {
    setLoading(true);
    const paylaodFields = getPayloadFields(
      fieldsToSave,
      responseFieldsToSave,
      labelFieldsToSave
    );

    const { success, message, fieldNameObjMap } = await getFieldNameObjMap(
      fieldsToSave,
      fieldNameMetaMap,
      table
    );

    if (!success) {
      openNotification(message, "error");
      setLoading(false);
      return;
    }

    const {
      success: successFromRecord,
      message: messageFromRecord,
      record,
    } = await formatOneRecord(
      recordIds[0],
      responseFieldsToSave,
      labelFieldsToSave,
      paylaodFields,
      fieldNameObjMap
    );

    if(!successFromRecord){
        openNotification(messageFromRecord, "error");
        setLoading(false);
        return;
    }

    console.log(record);
    setLoading(false);
    return;
  };

  if(recordIds.length === 0 || fieldsToSave.length === 0 || intoDBMethod !== IntoDBMethod.AllIn){
    return <div></div>
  }

  return (
    <Container>
      {contextHolder}
      <InfoContainer>需要等待时间较长，完成前请不要关闭本页面</InfoContainer>
      <Button loading={loading} onClick={handleAllIn}>
        全部入库
      </Button>
    </Container>
  );
};

export default AllInButton;
