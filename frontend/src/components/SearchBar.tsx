import { useRef } from "react";
import { styled } from "styled-components";

interface Props {
  onSubmit: (text: string) => void;
}

function SearchBar(props: Props) {
  const { onSubmit } = props;
  const searchBarRef = useRef<HTMLInputElement>(null);

  const SumbitButton = styled.button`
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
  `;

  const Input = styled.input`
    width: 300px;
  `;

  const GeneralWapper = styled.div`
    display: flex;
    gap: 15px;
  `;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(searchBarRef.current ? searchBarRef.current.value : "");
      }}
    >
      <GeneralWapper>
        <Input type="text" ref={searchBarRef} />
        <SumbitButton>Search</SumbitButton>
      </GeneralWapper>
    </form>
  );
}

export default SearchBar;
