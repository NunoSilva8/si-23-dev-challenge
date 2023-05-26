import { styled } from "styled-components";
import Avatar from "./Avatar";
import RoleIcon from "./RoleIcon";
import { RoleWithoutApplicants } from "../services/roles.service";
import AvatarList from "./AvatarList";
import { useNavigate } from "react-router-dom";

interface Props {
  data: { [x: string]: any }[];
  headers: { displayName: string; keyName: string }[];
}

function Table(props: Props) {
  let { data, headers } = props;
  const navigate = useNavigate();

  const onApplicantClick = (id: string) => {
    navigate("/applicant/" + id);
  };

  const onRoleClick = (id: string) => {
    // TODO
    console.log("ROLE", id);
  };

  const onRowClick = (val: { [x: string]: any }) => {
    if (val.email != undefined) {
      onApplicantClick(val._id);
    } else {
      onRoleClick(val._id);
    }
  };

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

  return (
    <Table>
      <thead>
        <tr>
          {headers.map((col) => {
            return <td>{col.displayName}</td>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((val) => {
            return (
              <tr
                onClick={() => {
                  onRowClick(val);
                }}
              >
                {headers.map((col) => {
                  if (col.keyName == "avatar") {
                    console.log(val);
                    return (
                      <td>
                        <Avatar
                          id={val._id}
                          name={val.name}
                          hasAvatar={val.avatar}
                        />
                      </td>
                    );
                  }
                  if (col.keyName == "roles") {
                    if (val.roles.length == 0) return <td></td>;
                    return val.roles.map((role: RoleWithoutApplicants) => {
                      return (
                        <td>
                          <RoleIcon onClick={onRoleClick} role={role} />
                        </td>
                      );
                    });
                  }
                  if (col.keyName == "applicants") {
                    return (
                      <td>
                        <AvatarList applicantList={val[col.keyName]} />
                      </td>
                    );
                  }

                  return <td>{val[col.keyName]}</td>;
                })}
              </tr>
            );
          })
        ) : (
          <></>
        )}
      </tbody>
    </Table>
  );
}

export default Table;
