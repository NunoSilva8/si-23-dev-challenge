import { useRef, useState } from "react";
import { styled } from "styled-components";
import Avatar from "./Avatar";

interface Props {
  id: string;
  name: string;
  hasAvatar: boolean;
  onChange: (updatedFile: File | undefined) => void;
}

function UpdateAvatar(props: Props) {
  const { id, name, hasAvatar, onChange } = props;
  const [newAvatar, setNewAvatar] = useState<File | undefined>();
  const avatarRef = useRef<HTMLInputElement>(null);

  const DeleteBtn = styled.button`
    cursor: pointer;
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
  `;

  const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
  `;

  const AvatarWrapper = styled.div`
    border-radius: 90px;
    overflow: hidden;
    width: 48px;
    height: 48px;
  `;
  return (
    <>
      <Row>
        {newAvatar ? (
          <>
            <AvatarWrapper>
              <img
                width="48px"
                height="48px"
                src={URL.createObjectURL(newAvatar)}
              />
            </AvatarWrapper>
            <DeleteBtn
              onClick={() => {
                setNewAvatar(undefined);
                if (avatarRef.current) avatarRef.current.value = "";
                onChange(undefined);
              }}
            >
              Delete
            </DeleteBtn>
          </>
        ) : (
          <>
            {hasAvatar ? (
              <Avatar id={id} name={name} hasAvatar={hasAvatar} />
            ) : (
              <Avatar
                id={id}
                name={name}
                hasAvatar={hasAvatar}
                isHidden={true}
              />
            )}
          </>
        )}
      </Row>
      <input
        type="file"
        accept="image/*"
        ref={avatarRef}
        onChange={(e) => {
          if (e.target.files) {
            setNewAvatar(e.target.files[0]);
          }
          onChange(e.target.files ? e.target.files[0] : undefined);
        }}
      />
    </>
  );
}

export default UpdateAvatar;
