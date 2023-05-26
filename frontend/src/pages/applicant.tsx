import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Applicant, getApplicant } from "../services/applicants.service";
import { styled } from "styled-components";
import { RoleWithoutApplicants } from "../services/roles.service";
import Avatar from "../components/Avatar";
import RoleIcon from "../components/RoleIcon";

function Applicant() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [roles, setRoles] = useState<RoleWithoutApplicants[]>([]);
  const [hasAvatar, setHasAvatar] = useState(false);

  const [isEditable, setEditable] = useState(false);

  useEffect(() => {
    if (id) {
      getApplicant(id)
        .then((res) => res.json())
        .then((applicant: Applicant) => {
          setName(applicant.name);
          setPhoneNumber(applicant.phoneNumber);
          setEmail(applicant.email);
          setStatus(applicant.status);
          //setRoles(applicant.roles);
          setHasAvatar(applicant.avatar);
        });
    }
  }, [id]);

  // DEBUG
  useEffect(() => {
    const deafultRole = { _id: "somng", name: "this is a role" };
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push(deafultRole);
    }
    setRoles(arr);
  }, []);

  const onRoleClick = (id: string) => {
    // TODO
    console.log("ROLE", id);
  };

  const PageWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    gap: 30px;
    overflow-y: scroll;
  `;

  const FieldWrapper = styled.div`
    display: flex;
    align-items: center;
  `;

  const LabelWrapper = styled.div`
    width: 150px;
  `;

  const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 30px;
  `;

  const Input = styled.input`
    width: 300px;
  `;

  const Select = styled.select`
    width: 300px;
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
    padding-top: 30px;
    border-bottom: 1px solid black;
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

  return (
    <PageWrapper>
      <OuterSeparator>
        <Separator>General Info:</Separator>
      </OuterSeparator>
      <Row>
        <Column>
          <FieldWrapper>
            <LabelWrapper>Name:</LabelWrapper>
            <Input
              disabled={!isEditable}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </FieldWrapper>
        </Column>
        <Column>
          <FieldWrapper>
            <LabelWrapper>Avatar:</LabelWrapper>
            {hasAvatar && id ? (
              <Avatar id={id} name={name} hasAvatar={hasAvatar} />
            ) : (
              <>No Avatar</>
            )}
          </FieldWrapper>
        </Column>
      </Row>

      <OuterSeparator>
        <Separator>Contacts:</Separator>
      </OuterSeparator>
      <Row>
        <Column>
          <FieldWrapper>
            <LabelWrapper>Email:</LabelWrapper>
            <Input
              disabled={!isEditable}
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FieldWrapper>
        </Column>

        <Column>
          <FieldWrapper>
            <LabelWrapper>Phone Number:</LabelWrapper>
            <Input
              disabled={!isEditable}
              type="text"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </FieldWrapper>
        </Column>
      </Row>

      <OuterSeparator>
        <Separator>Evaluation:</Separator>
      </OuterSeparator>
      <Row>
        <Column>
          <FieldWrapper>
            <LabelWrapper>Status:</LabelWrapper>
            <Select
              disabled={!isEditable}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <option value={"APPROVED"}>Approved</option>
              <option value={"REJECTED"}>Rejected</option>
              <option value={"UNDER ANALYSIS"}>Under Analysis</option>
            </Select>
          </FieldWrapper>
        </Column>

        <Column></Column>
      </Row>

      <OuterSeparator>
        <Separator>Roles:</Separator>
      </OuterSeparator>
      <Row>
        <RolePool>
          {roles.map((role) => {
            return <RoleIcon role={role} onClick={onRoleClick} />;
          })}
        </RolePool>
      </Row>
    </PageWrapper>
  );
}

export default Applicant;
