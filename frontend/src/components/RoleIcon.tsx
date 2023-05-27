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
    padding-left: 15px;
    padding-right: 20px;
    gap: 5px;
    width: fit-content;
    &:hover {
      background: #857e74;
      cursor: pointer;
    }
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const StatusCircle = styled(
    ({ status, ...rest }: { status: string; [x: string]: any }) => (
      <div {...rest} />
    )
  )`
    border: 1px solid black;
    padding: 3px;
    border-radius: 90px;
    background: ${(props) => {
      if (props.status == "APPROVED") return "#00FF00";
      if (props.status == "REJECTED") return "#ff0000";
      if (props.status == "UNDER ANALYSIS") return "#919191";
    }};
  `;

  return (
    <StyledDiv
      title={role.status}
      onClick={(e) => {
        onRoleClick(e, role.role._id);
      }}
    >
      <StatusCircle status={role.status} />
      {role.role.name}
    </StyledDiv>
  );
}

export default RoleIcon;
