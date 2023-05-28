import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicantWithoutRoles } from "../services/applicants.service";
import { styled } from "styled-components";
import {
  createRole,
  deleteRole,
  getRole,
  Role,
  updateRole,
} from "../services/roles.service";
import Table from "../components/Table";
import UpdateApplicantsTable from "../components/UpdateApplicantsTable";

function Role() {
  const { id } = useParams();
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [applicants, setApplicants] = useState<ApplicantWithoutRoles[]>([]);

  const [isEditable, setEditable] = useState(false);
  let updatedApplicants: { applicant: string; status: string }[] | undefined;

  useEffect(() => {
    if (id) {
      if (id == "new") {
        setEditable(true);
      } else {
        setEditable(false);
        onGet(id);
      }
    }
  }, [id]);

  const onGet = (id: string) => {
    getRole(id)
      .then((res) => res.json())
      .then((role: Role) => {
        setName(role.name);
        setApplicants(role.applicants);
      });
  };

  const onCreate = () => {
    if (nameRef.current) {
      if (nameRef.current.value == "") {
        nameRef.current.style.borderColor = "red";
      } else {
        nameRef.current.style.borderColor = "black";
        createRole(nameRef.current.value, updatedApplicants)
          .then((res) => res.json())
          .then((callback) => {
            navigate("/role/" + callback._id);
          });
      }
    }
  };

  const onUpdate = () => {
    if (id && nameRef.current) {
      if (nameRef.current.value == "") {
        nameRef.current.style.borderColor = "red";
      } else {
        nameRef.current.style.borderColor = "black";
        updateRole(id, nameRef.current.value, updatedApplicants)
          .then((res) => res.json())
          .then(() => {
            setEditable(false);
            onGet(id);
          });
      }
    }
  };

  const onDelete = () => {
    if (id)
      deleteRole(id)
        .then((res) => res.json())
        .then(() => {
          navigate("/roles");
        });
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

  const ActionBtn = styled(
    ({ isVisible, ...rest }: { isVisible: boolean; [x: string]: any }) => (
      <button {...rest} />
    )
  )`
    visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
  `;

  const FloatingBtn = styled.button`
    position: fixed;
    right: 14%;
    bottom: 5%;
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
  `;

  const FloatingDiv = styled.div`
    position: fixed;
    display: flex;
    right: 14%;
    bottom: 5%;
  `;

  const ApplicantsTableOuterWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  `;

  const ApplicantsTableWrapper = styled.div`
    height: 70%;
    width: 60%;
    overflow-y: scroll;

    border: 1px solid black;
    border-spacing: 0;
    border-radius: 12px;
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
        <Column>{/* EMPTY COLUMN */}</Column>
      </Row>

      <OuterSeparator>
        <Separator>Applicants:</Separator>
      </OuterSeparator>
      <ApplicantsTableOuterWrapper>
        {isEditable ? (
          <UpdateApplicantsTable
            roleApplicantList={applicants}
            onChange={(list) => {
              updatedApplicants = list;
            }}
          />
        ) : (
          <ApplicantsTableWrapper>
            <Table
              data={applicants}
              headers={[
                { displayName: "Avatar", keyName: "avatar" },
                { displayName: "Name", keyName: "name" },
                { displayName: "Email", keyName: "email" },
                { displayName: "Phone Number", keyName: "phoneNumber" },
                { displayName: "Status", keyName: "status" },
              ]}
            />
          </ApplicantsTableWrapper>
        )}
      </ApplicantsTableOuterWrapper>
      {isEditable ? (
        <>
          {id == "new" ? (
            <FloatingBtn onClick={onCreate}>Create</FloatingBtn>
          ) : (
            <FloatingDiv>
              <ActionBtn
                isVisible={true}
                onClick={() => {
                  if (id) {
                    setEditable(false);
                    onGet(id);
                  }
                }}
              >
                Cancel
              </ActionBtn>
              <ActionBtn isVisible={true} onClick={onUpdate}>
                Save
              </ActionBtn>
            </FloatingDiv>
          )}
        </>
      ) : (
        <></>
      )}
    </Page>
  );
}

export default Role;
