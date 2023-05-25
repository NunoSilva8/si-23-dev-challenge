import { styled } from "styled-components";

interface Props {
  name: string;
  onClick: (id: string) => void;
}

function RoleIcon(props: Props) {
  const { name } = props;
  const StyledDiv = styled.div`
    border: 1px solid black;
    border-radius: 12px;
    padding: 5px;
  `;

  return <StyledDiv>{name}</StyledDiv>;
}

export default RoleIcon;
