import { useEffect, useState } from "react";
import { Role, getRolesList } from "../services/roles.service";
import { styled } from "styled-components";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";

function Roles() {
  const [rolesList, setRolesList] = useState<Role[]>([]);

  useEffect(() => {
    getRolesList()
      .then((res) => res.json())
      .then((data: Role[]) => {
        setRolesList(data);
      });
  }, []);

  const newSearch = (text: string) => {
    getRolesList({ name: text })
      .then((res) => res.json())
      .then((data: Role[]) => {
        setRolesList(data);
      });
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
          data={rolesList}
          headers={[
            { displayName: "Name", keyName: "name" },
            { displayName: "Applicants", keyName: "applicants" },
          ]}
        />
      </TableWrapper>
    </PageWrapper>
  );
}

export default Roles;
