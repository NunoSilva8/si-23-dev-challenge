import { ApplicantWithoutRoles } from "../services/applicants.service";
import Avatar from "./Avatar";
import { styled } from "styled-components";

interface Props {
  applicantList: ApplicantWithoutRoles[];
}

function AvatarList(props: Props) {
  const { applicantList } = props;

  const AvatarWrapper = styled(
    ({ index, ...rest }: { index: number; [x: string]: any }) => (
      <div {...rest} />
    )
  )`
    border: 1px solid black;
    border-radius: 90px;
    width: fit-content;
    height: fit-content;
    position: relative;
    left: ${(props) => (props.index == 0 ? "0%" : "-3%")};

    &:hover {
      border: 2px solid black;
    }
  `;

  const GeneralWrapper = styled.div`
    display: flex;
  `;

  return (
    <GeneralWrapper>
      {applicantList.length > 0 ? (
        applicantList.map((applicant, index) => {
          return (
            <AvatarWrapper index={index}>
              <Avatar
                id={applicant._id}
                name={applicant.name}
                hasAvatar={applicant.avatar}
              />
            </AvatarWrapper>
          );
        })
      ) : (
        <></>
      )}
    </GeneralWrapper>
  );
}

export default AvatarList;
