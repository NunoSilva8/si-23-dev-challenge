import { backendURL } from "../utils/config.json";

const baseURL = backendURL + "applicant/";

export interface Applicant {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  status: string;
  roles: {
    _id: string;
    name: string;
  }[];
  avatar: boolean;
}

export function getApplicantsList(queryParams?: {
  name?: string;
  email?: string;
}) {
  if (queryParams?.name) {
    return fetch(
      baseURL + "?" + new URLSearchParams({ name: queryParams.name })
    );
  } else if (queryParams?.email) {
    return fetch(
      baseURL + "?" + new URLSearchParams({ email: queryParams.email })
    );
  } else {
    return fetch(baseURL);
  }
}
