import { styled } from "styled-components";
import { RoleWithoutApplicants } from "../services/roles.service";

interface Props {
  role: RoleWithoutApplicants;
  onClick: (id: string) => void;
}

function RoleIcon(props: Props) {
  const { role, onClick } = props;

  const onRoleClick = (event: React.MouseEvent<HTMLDivElement>, id: string) => {
    event.stopPropagation();
    onClick(id);
  };

  const StyledDiv = styled.div`
    border: 1px solid black;
    border-radius: 12px;
    padding: 5px;
    padding-left: 20px;
    padding-right: 20px;
    width: fit-content;
    &:hover {
      background: #857e74;
      cursor: pointer;
    }
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  return (
    <StyledDiv
      onClick={(e) => {
        onRoleClick(e, role._id);
      }}
    >
      {role.name}
    </StyledDiv>
  );
}

export default RoleIcon;
