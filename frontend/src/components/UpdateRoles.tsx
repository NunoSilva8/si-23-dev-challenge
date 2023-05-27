import { styled } from "styled-components";
import {
  Role,
  RoleWithoutApplicants,
  getRolesList,
} from "../services/roles.service";
import { useEffect, useState } from "react";

interface Props {
  applicantRoleList: RoleWithoutApplicants[];
  onChange: (updatedList: { role: string; status: string }[]) => void;
}

function UpdateRoles(props: Props) {
  const { applicantRoleList, onChange } = props;
  const [allRoleList, setAllRoleList] = useState<RoleWithoutApplicants[]>([]);

  const containsRole = (id: string) => {
    for (let index = 0; index < applicantRoleList.length; index++) {
      let bigRole = applicantRoleList[index];
      if (bigRole.role._id == id) return index;
    }
    return -1;
  };

  const updateRole = (index: number, newStatus: string) => {
    let newList = allRoleList.map((elem, i) => {
      if (index == i) {
        let copy = { ...elem };
        copy.status = newStatus;
        return copy;
      }
      return elem;
    });

    setAllRoleList(newList);

    onChange(
      newList
        .filter((elem) => elem.status != "")
        .map((elem) => ({ role: elem.role._id, status: elem.status }))
    );
  };

  useEffect(() => {
    getRolesList()
      .then((res) => res.json())
      .then((roleList: Role[]) => {
        let formatedList = roleList.map((elem) => {
          let roleIndex = containsRole(elem._id);
          if (roleIndex != -1) {
            return applicantRoleList[roleIndex];
          } else {
            return { role: { _id: elem._id, name: elem.name }, status: "" };
          }
        });
        formatedList = formatedList.sort((first, second) => {
          if (first.status == "") {
            if (second.status == "") return 0;
            return 1;
          } else {
            if (second.status == "") return -1;
            return 0;
          }
        });
        setAllRoleList(formatedList);
      });
  }, []);

  const RolePool = styled.div`
    border: 1px solid black;
    border-spacing: 0;
    border-radius: 12px;
    width: 60%;
    height: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
  `;

  const Row = styled.div`
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const Label = styled.div`
    width: 100px;
  `;

  return (
    <RolePool>
      {allRoleList.length > 0 ? (
        allRoleList.map((elem, index) => (
          <Row key={index}>
            <input
              defaultChecked={elem.status != ""}
              type="checkbox"
              onChange={() => {
                if (elem.status != "") updateRole(index, "");
                else updateRole(index, "UNDER ANALYSIS");
              }}
            />
            <Label>{elem.role.name}</Label>
            <select
              disabled={elem.status == ""}
              value={elem.status}
              onChange={(e) => {
                updateRole(index, e.target.value);
              }}
            >
              <option value={"UNDER ANALYSIS"}>Under Analysis</option>
              <option value={"APPROVED"}>Approved</option>
              <option value={"REJECTED"}>Rejected</option>
            </select>
          </Row>
        ))
      ) : (
        <></>
      )}
    </RolePool>
  );
}

export default UpdateRoles;
