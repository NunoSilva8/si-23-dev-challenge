import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Applicant, getApplicant } from "../services/applicants.service";
import { styled } from "styled-components";
import { RoleWithoutApplicants } from "../services/roles.service";
import Avatar from "../components/Avatar";
import RoleIcon from "../components/RoleIcon";
import UpdateRoles from "../components/UpdateRoles";
import UpdateAvatar from "../components/UpdateAvatar";

function Applicant() {
  const { id } = useParams();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<RoleWithoutApplicants[]>([]);
  const [hasAvatar, setHasAvatar] = useState(false);

  const [isEditable, setEditable] = useState(false);
  let updatedRoles: { role: string; status: string }[] | undefined;
  let updatedAvatar: File | undefined;

  useEffect(() => {
    if (id) {
      if (id == "new") {
        setEditable(true);
      } else {
        onGet(id);
      }
    }
  }, [id]);

  const onRoleClick = (id: string) => {
    // TODO
    console.log("ROLE", id);
  };

  const onGet = (id: string) => {
    getApplicant(id)
      .then((res) => res.json())
      .then((applicant: Applicant) => {
        setName(applicant.name);
        setPhoneNumber(applicant.phoneNumber);
        setEmail(applicant.email);
        setRoles(applicant.roles);
        setHasAvatar(applicant.avatar);
      });
  };

  const onCreate = () => {
    // TODO
  };

  const onUpdate = () => {
    // TODO
  };

  const onDelete = () => {
    // TODO
  };

  const Page = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    gap: 30px;
    overflow-y: scroll;
  `;

  const Field = styled.div`
    display: flex;
    align-items: center;
  `;

  const Label = styled.div`
    width: 150px;
  `;

  const Input = styled.input`
    width: 300px;
  `;

  const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 30px;
  `;

  const Column = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 30px;
  `;

  const OuterSeparator = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `;

  const Separator = styled.div`
    width: 70%;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 30px;
    border-bottom: 1px solid black;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  `;

  const RolePool = styled.div`
    border: 1px solid black;
    border-spacing: 0;
    border-radius: 12px;
    width: 60%;
    padding: 10px;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  `;

  const ActionBtn = styled(
    ({ isVisible, ...rest }: { isVisible: boolean; [x: string]: any }) => (
      <button {...rest} />
    )
  )`
    visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
  `;

  const UpdateAvatarColumn = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
  `;

  const FloatingBtn = styled.button`
    position: fixed;
    right: 14%;
    bottom: 5%;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
  `;

  return (
    <Page>
      <OuterSeparator>
        <Separator>
          General Info:
          <div>
            <ActionBtn
              isVisible={!isEditable}
              onClick={() => {
                setEditable((prevValue) => !prevValue);
              }}
            >
              Edit
            </ActionBtn>
            <ActionBtn isVisible={!isEditable} onClick={onDelete}>
              Delete
            </ActionBtn>
          </div>
        </Separator>
      </OuterSeparator>
      <Row>
        <Column>
          <Field>
            <Label>Name:</Label>
            <Input
              disabled={!isEditable}
              type="text"
              ref={nameRef}
              defaultValue={name}
            />
          </Field>
        </Column>
        <Column>
          <Field>
            <Label>Avatar:</Label>
            {id ? (
              <>
                {isEditable ? (
                  <UpdateAvatarColumn>
                    <UpdateAvatar
                      id={id}
                      name={name}
                      hasAvatar={hasAvatar}
                      onChange={(file) => {
                        console.log(file);
                        updatedAvatar = file;
                      }}
                    />
                  </UpdateAvatarColumn>
                ) : (
                  <>
                    {hasAvatar ? (
                      <Avatar id={id} name={name} hasAvatar={hasAvatar} />
                    ) : (
                      <>No Avatar</>
                    )}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </Field>
        </Column>
      </Row>

      <OuterSeparator>
        <Separator>Contacts:</Separator>
      </OuterSeparator>
      <Row>
        <Column>
          <Field>
            <Label>Email:</Label>
            <Input
              disabled={!isEditable}
              type="text"
              ref={emailRef}
              defaultValue={email}
            />
          </Field>
        </Column>

        <Column>
          <Field>
            <Label>Phone Number:</Label>
            <Input
              disabled={!isEditable}
              type="tel"
              ref={phoneNumberRef}
              defaultValue={phoneNumber}
            />
          </Field>
        </Column>
      </Row>

      <OuterSeparator>
        <Separator>Roles:</Separator>
      </OuterSeparator>
      <Row>
        {isEditable ? (
          <UpdateRoles
            applicantRoleList={roles}
            onChange={(list) => {
              updatedRoles = list;
            }}
          />
        ) : (
          <RolePool>
            {roles.map((role, index) => {
              return <RoleIcon key={index} role={role} onClick={onRoleClick} />;
            })}
          </RolePool>
        )}
      </Row>
      {isEditable ? (
        <>
          {id == "new" ? (
            <FloatingBtn onClick={onCreate}>Create</FloatingBtn>
          ) : (
            <FloatingBtn onClick={onUpdate}>Save</FloatingBtn>
          )}
        </>
      ) : (
        <></>
      )}
    </Page>
  );
}

export default Applicant;
