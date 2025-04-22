import React from "react";
import styled from "styled-components";
import useTableDataStore from "../stores/tableData";

const OutInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eaf6ff;
  border: 1.5px solid #b1ddfa;
  border-radius: 8px;
  margin-top: 1rem;
  padding: 0.8rem 1.6rem;
  box-shadow: 0 1px 8px rgba(0, 94, 230, 0.03);
  font-size: 16px;
  font-family: inherit;
  /* 可选加色条 */
  // border-left: 5px solid #0371e3;
  // padding-left: 1.5rem;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  p {
    margin: 0 2px;
    color: #2276be;
    font-size: 16px;
  }
  h1 {
    font-size: 1.7rem;
    margin: 0 5px;
    color: #0371e3;
    font-weight: bold;
    letter-spacing: 1px;
  }
`;

const RecordsInfoNotification = () => {
  const { recordIds } = useTableDataStore();

  return (
    <OutInfoContainer>
      <InfoContainer>
        <p>共有</p>
        <h1>{recordIds.length}</h1>
        <p>条记录</p>
      </InfoContainer>
    </OutInfoContainer>
  );
};

export default RecordsInfoNotification;
