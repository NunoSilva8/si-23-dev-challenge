import { useEffect, useState } from "react";
import Table from "../components/Table";
import { Applicant, getApplicantsList } from "../services/applicants.service";

function Applicants() {
  const [applicantsList, setApplicantsList] = useState<Applicant[]>([]);

  useEffect(() => {
    getApplicantsList()
      .then((res) => res.json())
      .then((data: Applicant[]) => {
        setApplicantsList(data);
        console.log(data);
      });
  }, []);

  return (
    <>
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
        hasAvatar={true}
      />
    </>
  );
}

export default Applicants;
