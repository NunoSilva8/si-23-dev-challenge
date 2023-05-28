import { useEffect, useState } from "react";
import Table from "../components/Table";
import { Applicant, getApplicantsList } from "../services/applicants.service";
import { styled } from "styled-components";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

function Applicants() {
  const [applicantsList, setApplicantsList] = useState<Applicant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getApplicantsList()
      .then((res) => res.json())
      .then((data: Applicant[]) => {
        setApplicantsList(data);
      });
  }, []);

  const newSearch = (text: string) => {
    if (text.indexOf("@") == -1) {
      // It's a name

      getApplicantsList({ name: text })
        .then((res) => res.json())
        .then((data: Applicant[]) => {
          setApplicantsList(data);
        });
    } else {
      // It's an email

      getApplicantsList({ email: text })
        .then((res) => res.json())
        .then((data: Applicant[]) => {
          setApplicantsList(data);
        })
        .catch(() => {
          setApplicantsList([]);
        });
    }
  };

  const onCreateNewApplicantClick = () => {
    navigate("/applicant/new");
  };

  const TableWrapper = styled.div`
    height: 70%;
    width: 80%;
    overflow-y: scroll;

    border-spacing: 0;
    border: 1px solid black;
    border-radius: 12px;
  `;

  const PageWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 30px;
    gap: 30px;
  `;

  const BtnWrapper = styled.div`
    display: flex;
    width: 80%;
    padding-right: 15px;
    justify-content: flex-end;
  `;

  const ActionBtn = styled.button`
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
  `;

  return (
    <PageWrapper>
      <SearchBar onSubmit={newSearch} />
      <TableWrapper>
        <Table
          data={applicantsList}
          headers={[
            { displayName: "Avatar", keyName: "avatar" },
            { displayName: "Name", keyName: "name" },
            { displayName: "Email", keyName: "email" },
            { displayName: "Phone Number", keyName: "phoneNumber" },
            { displayName: "Roles", keyName: "roles" },
          ]}
        />
      </TableWrapper>
      <BtnWrapper>
        <ActionBtn onClick={onCreateNewApplicantClick}>Create New</ActionBtn>
      </BtnWrapper>
    </PageWrapper>
  );
}

export default Applicants;
