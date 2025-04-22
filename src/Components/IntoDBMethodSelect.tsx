import React from "react";
import FormItemContainer from "./FormItemContainer";
import { Radio } from "antd";
import { INTO_DB_METHOD_OPTIONS } from "../utils/constants";
import useTableDataStore from "../stores/tableData";

const IntoDBMethodSelect = () => {
  const { intoDBMethod, setIntoDBMethod, fieldsToSave, recordIds } =
    useTableDataStore();

  if (fieldsToSave.length === 0 || recordIds.length === 0) {
    return <div></div>;
  }

  return (
    <FormItemContainer>
      <h5>数据入库方式：</h5>
      <Radio.Group
        value={intoDBMethod}
        onChange={(e) => {
          setIntoDBMethod(e.target.value);
        }}
        options={INTO_DB_METHOD_OPTIONS}
      />
    </FormItemContainer>
  );
};

export default IntoDBMethodSelect;
