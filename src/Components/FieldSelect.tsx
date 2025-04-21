import React from "react";
import FormItemContainer from "./FormItemContainer";
import { Checkbox, Divider } from "antd";
import styled from "styled-components";
import useTableDataStore from "../stores/tableData";
import { CheckboxValueType } from "antd/es/checkbox/Group";

const Container = styled.div``;

const FieldSelect = () => {
  const { fieldOptions, fieldsToSave, setFieldsToSave } = useTableDataStore();
  const handleChange = (list: Array<CheckboxValueType>) => {
    setFieldsToSave(
      list.map((item) => {
        return item.toString();
      })
    );
  };

  return (
    <Container>
      <h5>请勾选需要入库的字段：</h5>

      <Checkbox.Group
        options={fieldOptions}
        value={fieldsToSave}
        onChange={handleChange}
      />
    </Container>
  );
};

export default FieldSelect;
