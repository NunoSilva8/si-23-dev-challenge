import { styled } from "styled-components";
import { backendURL } from "../utils/config.json";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  name: string;
  hasAvatar: boolean;
  isHidden?: boolean;
}

function Avatar(props: Props) {
  const { id, name, hasAvatar, isHidden } = props;
  const navigate = useNavigate();

  const onAvatarClick = (
    event: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    event.stopPropagation();
    navigate("/applicant/" + id);
  };

  const ImgWrapper = styled(
    ({ isHidden, ...rest }: { isHidden: boolean; [x: string]: any }) => (
      <div {...rest} />
    )
  )`
    visibility: ${(props) => (props.isHidden ? "hidden" : "visible")};
    border-radius: 90px;
    overflow: hidden;
    width: 48px;
    height: 48px;
  `;

  const NoAvatar = styled.div`
    background: #383838;
    height: 100%;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  return (
    <ImgWrapper
      isHidden={isHidden}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        onAvatarClick(e, id);
      }}
    >
      {hasAvatar ? (
        <img
          width="48px"
          height="48px"
          alt={name}
          src={backendURL + "applicant/" + id + "/avatar"}
        />
      ) : (
        <NoAvatar>{name.charAt(0).toUpperCase()}</NoAvatar>
      )}
    </ImgWrapper>
  );
}

export default Avatar;
