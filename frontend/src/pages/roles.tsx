import { useEffect, useState } from "react";
import { Role, getRolesList } from "../services/roles.service";
import { styled } from "styled-components";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";

function Roles() {
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const navigate = useNavigate();

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

  const onCreateNewRoleClick = () => {
    navigate("/role/new");
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
          data={rolesList}
          headers={[
            { displayName: "Name", keyName: "name" },
            { displayName: "Applicants", keyName: "applicants" },
          ]}
        />
      </TableWrapper>
      <BtnWrapper>
        <ActionBtn onClick={onCreateNewRoleClick}>Create New</ActionBtn>
      </BtnWrapper>
    </PageWrapper>
  );
}

export default Roles;
