import { useEffect, useState } from "react";
import Table from "../components/Table";
import { Applicant, getApplicantsList } from "../services/applicants.service";
import { styled } from "styled-components";
import SearchBar from "../components/SearchBar";

function Applicants() {
  const [applicantsList, setApplicantsList] = useState<Applicant[]>([]);

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
      console.log(text);

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
            { displayName: "Status", keyName: "status" },
          ]}
        />
      </TableWrapper>
    </PageWrapper>
  );
}

export default Applicants;
