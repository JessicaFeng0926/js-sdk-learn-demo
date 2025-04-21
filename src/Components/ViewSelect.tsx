import React, { useCallback, useContext, useMemo, useState } from "react";
import { Select } from "antd";
import styled from "styled-components";
import FormItemContainer from "./FormItemContainer";
import useTableDataStore from "../stores/tableData";

const TaskSelect = () => {
  const { view, setView, viewMetaList, table } = useTableDataStore();
  const [viewId, setViewId] = useState("");

  const options = useMemo(() => {
    if(!viewMetaList){
        return []
    }
    return viewMetaList.map((meta) => {
      return { label: meta.name, value: meta.id };
    });
  }, [viewMetaList]);


  const handleChange = useCallback(async (value: string)=>{
    setViewId(value);
    if(table){
        const newView = await table.getViewById(value);
        setView(newView);
        const recordList = await newView.getVisibleRecordIdList();
        console.log(recordList.length, recordList[0]);
    }
    
  }, [viewMetaList])

  return (
    <FormItemContainer>
      <h5>请选择视图：</h5>
      <Select
        style={{ flex: 1 }}
        showSearch
        filterOption={(input, option) => {
          return `${option?.label ?? ""}`.includes(input);
        }}
        options={options}
        value={viewId}
        onChange={handleChange}
        
      />
    </FormItemContainer>
  );
};

export default TaskSelect;
