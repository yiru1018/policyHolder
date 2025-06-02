import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Search from "./Search";
import TreeDiagram from "./TreeDiagram";

const StyledMainWrapper = styled.div`
  padding: 16px;
  margin: 0;
  box-sizing: border-box;
  font-family: "Noto Sans TC", sans-serif;
  height: 100vh;
`;

const parseData = (res, mainNodeCode) => {
  const MAX_DEPTH = 4;

  const getNodeType = (code, introducerCode) => {
    if (code === mainNodeCode) return "main";
    if (introducerCode === mainNodeCode) return "direct";
    return "indirect";
  };

  const formData = (obj, depth = 1) => {
    if (depth > MAX_DEPTH) return null;

    const policyHolder = {
      name: obj.name,
      attributes: {
        code: obj.code,
        type: getNodeType(obj.code, obj.introducer_code),
        introducerCode: obj.introducer_code,
      },
    };

    if (depth < MAX_DEPTH) {
      const extractArray = (v) => {
        if (Array.isArray(v)) return v;
        if (v && typeof v === "object") return [v];
        return [];
      };

      const allChildren = [...extractArray(obj.l), ...extractArray(obj.r)]
        .map((child) => formData(child, depth + 1))
        .filter(Boolean);

      if (allChildren.length > 0) {
        policyHolder.children = allChildren;
      }
    }

    return policyHolder;
  };

  return formData(res);
};

const App = () => {
  const [searchVal, setSearchVal] = useState("");
  const [treeData, setTreeData] = useState([]);

  const previousNodeCodeRef = useRef(null);

  const getDataByNodeCode = async (nodeCode) => {
    if (nodeCode === previousNodeCodeRef.current) return;

    previousNodeCodeRef.current = nodeCode;

    const url = `https://30252277-9fae-46e4-b499-07e9a6b24c69.mock.pstmn.io/api/policyholders?code=${nodeCode}`;
    const res = await fetch(url);
    const resData = await res.json();
    const parsedData = parseData(resData, nodeCode);
    setTreeData([parsedData]);
  };

  const onTrackParentStack = async (nodeCode) => {
    const url = `https://30252277-9fae-46e4-b499-07e9a6b24c69.mock.pstmn.io/api/policyholders/${nodeCode}/top`;
    const res = await fetch(url);
    const resData = await res.json();
    const parsedData = parseData(resData, resData.code);
    setTreeData([parsedData]);
  };

  useEffect(() => {
    getDataByNodeCode("001");
  }, []);

  return (
    <StyledMainWrapper>
      <Search
        inputVal={searchVal}
        onInputValChange={setSearchVal}
        onSearchBtnClick={getDataByNodeCode}
      />
      {treeData.length > 0 && (
        <TreeDiagram
          treeData={treeData}
          setTreeData={setTreeData}
          onNodeCodeClick={getDataByNodeCode}
          onTrackParentStack={onTrackParentStack}
        />
      )}
    </StyledMainWrapper>
  );
};
export default App;
