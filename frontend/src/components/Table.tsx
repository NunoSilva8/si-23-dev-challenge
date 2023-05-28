import { styled } from "styled-components";
import Avatar from "./Avatar";
import RoleIcon from "./RoleIcon";
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
    navigate("/role/" + id);
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

  const RolePool = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 30px;
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
                    return (
                      <td>
                        <RolePool>
                          <RoleIcon onClick={onRoleClick} role={val.roles[0]} />

                          {val.roles.length > 1 ? (
                            <RoleIcon
                              onClick={onRoleClick}
                              role={val.roles[1]}
                            />
                          ) : (
                            <></>
                          )}
                          {val.roles.length > 2 ? <>...</> : <></>}
                        </RolePool>
                      </td>
                    );
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
