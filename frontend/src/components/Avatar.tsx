import { backendURL } from "../utils/config.json";

interface Props {
  id: string;
}

function Avatar(props: Props) {
  const { id } = props;

  return (
    <img
      width="48"
      height="48"
      src={backendURL + "applicant/" + id + "/avatar"}
    />
  );
}

export default Avatar;
