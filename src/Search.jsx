import styled from "styled-components";

const StyledWrapper = styled.div`
  width: 380px;
  display: flex;
  justify-content: space-between;
`;

const StyledSearchBox = styled.input`
  width: 300px;
  height: 20px;
  padding: 4px;
`;

const StyledBtn = styled.button`
  width: 60px;
`;

const Search = (props) => {
  return (
    <StyledWrapper>
      <StyledSearchBox
        value={props.inputVal}
        onChange={(e) => {
          props.onInputValChange(e.target.value);
        }}
        type="text"
        placeholder="請輸入保戶編號"
      />
      <StyledBtn
        onClick={() => {
          props.onSearchBtnClick(props.inputVal);
        }}
      >
        sraech
      </StyledBtn>
    </StyledWrapper>
  );
};
export default Search;
