import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

interface Props {
  onSubmit: (text: string) => void;
}

function SearchBar(props: Props) {
  const { onSubmit } = props;
  const [text, setText] = useState("");

  const SumbitButton = styled.button``;

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
        onSubmit(text);
      }}
    >
      <GeneralWapper>
        <Input
          autoFocus
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <SumbitButton>Search</SumbitButton>
      </GeneralWapper>
    </form>
  );
}

export default SearchBar;
