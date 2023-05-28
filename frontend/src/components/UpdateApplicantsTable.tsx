import { useEffect, useState } from "react";
import {
  Applicant,
  ApplicantWithoutRoles,
  getApplicantsList,
} from "../services/applicants.service";
import { styled } from "styled-components";
import Avatar from "./Avatar";

interface Props {
  roleApplicantList: ApplicantWithoutRoles[];
  onChange: (updatedList: { applicant: string; status: string }[]) => void;
}

function UpdateApplicantsTable(props: Props) {
  const { roleApplicantList, onChange } = props;
  const [allApplicantsList, setAllApplicantsList] = useState<
    ApplicantWithoutRoles[]
  >([]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const containsApplicant = (id: string) => {
    for (let index = 0; index < roleApplicantList.length; index++) {
      let applicant = roleApplicantList[index];
      if (applicant._id == id) return index;
    }
    return -1;
  };

  const updateApplicant = (index: number, newStatus: string) => {
    let newList = allApplicantsList.map((elem, i) => {
      if (index == i) {
        let copy = { ...elem };
        copy.status = newStatus;
        return copy;
      }
      return elem;
    });

    setAllApplicantsList(newList);

    onChange(
      newList
        .filter((elem) => elem.status != "")
        .map((elem) => ({ applicant: elem._id, status: elem.status }))
    );
  };

  const updateSelectedApplicants = (newStatus: string) => {
    let newList = allApplicantsList.map((elem) => {
      if (elem.status != "") {
        let copy = { ...elem };
        copy.status = newStatus;
        return copy;
      }
      return elem;
    });

    setAllApplicantsList(newList);

    onChange(
      newList
        .filter((elem) => elem.status != "")
        .map((elem) => ({ applicant: elem._id, status: elem.status }))
    );
  };

  const selectApplicants = (select: boolean) => {
    let newList;
    if (select) {
      newList = allApplicantsList.map((elem) => {
        if (elem.status == "") {
          let copy = { ...elem };
          copy.status = "UNDER ANALYSIS";
          return copy;
        }
        return elem;
      });
    } else {
      newList = allApplicantsList.map((elem) => {
        let copy = { ...elem };
        copy.status = "";
        return copy;
      });
    }

    setAllApplicantsList(newList);

    onChange(
      newList
        .filter((elem) => elem.status != "")
        .map((elem) => ({ applicant: elem._id, status: elem.status }))
    );
  };

  useEffect(() => {
    getApplicantsList()
      .then((res) => res.json())
      .then((applicantList: Applicant[]) => {
        let formatedList = applicantList.map((elem) => {
          let applicantIndex = containsApplicant(elem._id);
          if (applicantIndex != -1) {
            return roleApplicantList[applicantIndex];
          } else {
            return {
              _id: elem._id,
              name: elem.name,
              phoneNumber: elem.phoneNumber,
              email: elem.email,
              status: "",
              avatar: elem.avatar,
            };
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
        setAllApplicantsList(formatedList);
      });
  }, []);

  const Table = styled.table`
    border-spacing: 0;
    display: block;
    background: #ffffff;
    overflow: hidden;
    width: 100%;
    table-layout: fixed;

    thead {
      td {
        width: 1%;
        border-bottom: 2px solid black;
      }
    }

    td {
      padding: 5px;
      height: 30px;
      &:last-child {
        border-right: none;
      }
    }

    tbody {
      tr {
        &:hover {
          cursor: pointer;
          background: #beb4a5;
        }
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  `;

  const ApplicantsTableWrapper = styled.div`
    height: 70%;
    width: 60%;
    overflow-y: scroll;

    border: 1px solid black;
    border-spacing: 0;
    border-radius: 12px;
  `;

  const ActionBtn = styled.button`
    margin: 3px;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
  `;

  const BtnDiv = styled.div`
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  return (
    <>
      <ApplicantsTableWrapper>
        <Table>
          <thead>
            <tr>
              <td>
                <input
                  defaultChecked={selectAllChecked}
                  type="checkbox"
                  onChange={() => {
                    setSelectAllChecked(!selectAllChecked);
                    selectApplicants(!selectAllChecked);
                  }}
                />
              </td>
              <td>Avatar</td>
              <td>Name</td>
              <td>Email</td>
              <td>Phone Number</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {allApplicantsList.length > 0 ? (
              allApplicantsList.map((applicant, index) => {
                return (
                  <tr>
                    <td>
                      <input
                        defaultChecked={applicant.status != ""}
                        type="checkbox"
                        onChange={() => {
                          if (applicant.status != "")
                            updateApplicant(index, "");
                          else updateApplicant(index, "UNDER ANALYSIS");
                        }}
                      />
                    </td>
                    <td>
                      <Avatar
                        id={applicant._id}
                        name={applicant.name}
                        hasAvatar={applicant.avatar}
                      />
                    </td>
                    <td>{applicant.name}</td>
                    <td>{applicant.email}</td>
                    <td>{applicant.phoneNumber}</td>
                    <td>
                      <select
                        disabled={applicant.status == ""}
                        value={applicant.status}
                        onChange={(e) => {
                          updateApplicant(index, e.target.value);
                        }}
                      >
                        <option value={"UNDER ANALYSIS"}>Under Analysis</option>
                        <option value={"APPROVED"}>Approved</option>
                        <option value={"REJECTED"}>Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      </ApplicantsTableWrapper>
      <BtnDiv>
        Set selected to:
        <ActionBtn
          onClick={() => {
            updateSelectedApplicants("APPROVED");
          }}
        >
          Approved
        </ActionBtn>
        <ActionBtn
          onClick={() => {
            updateSelectedApplicants("UNDER ANALYSIS");
          }}
        >
          Under Analysis
        </ActionBtn>
        <ActionBtn
          onClick={() => {
            updateSelectedApplicants("REJECTED");
          }}
        >
          Rejected
        </ActionBtn>
      </BtnDiv>
    </>
  );
}

export default UpdateApplicantsTable;
