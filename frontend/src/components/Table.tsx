import { styled } from "styled-components";
import Avatar from "./Avatar";
import RoleIcon from "./RoleIcon";

interface Props {
  data: { [x: string]: any }[];
  hasAvatar?: boolean;
  headers: { displayName: string; keyName: string }[];
}

function Table(props: Props) {
  let { data, headers, hasAvatar } = props;

  const onApplicantClick = (id: string) => {};
  const onRoleClick = (id: string) => {};

  const Table = styled.table`
    border-spacing: 0;
    width: 100%;
    height: 100%;
    border: 1px solid black;
    border-radius: 12px;
    overflow: hidden;
    thead {
    }
    td {
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      padding: 5px;
      position: relative;
      &:last-child {
        border-right: none;
        width: 150px;
      }
    }
    tbody {
      tr {
        &:hover {
          background: #beb4a5;
          cursor: pointer;
        }
      }
    }
  `;

  return (
    <Table>
      <thead>
        <tr>
          {hasAvatar ? <td>Avatar</td> : <></>}
          {headers.map((col) => {
            if (col.keyName != "avatar") return <td>{col.displayName}</td>;
            return <></>;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((val) => {
          return (
            <tr>
              {hasAvatar ? (
                <td>{val.avatar ? <Avatar id={val._id} /> : <></>}</td>
              ) : (
                <></>
              )}
              {headers.map((col) => {
                if (col.keyName == "roles") {
                  if (val.roles.length == 0) return <td></td>;
                  return val.roles.map(
                    (role: { _id: string; name: string }) => {
                      return (
                        <td>
                          <RoleIcon onClick={onRoleClick} name={role.name} />
                        </td>
                      );
                    }
                  );
                }
                if (col.keyName == "avatar") {
                  return <></>;
                }
                return <td>{val[col.keyName]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default Table;
