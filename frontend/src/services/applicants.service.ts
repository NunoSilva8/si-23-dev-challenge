import { backendURL } from "../utils/config.json";
import { RoleWithoutApplicants } from "./roles.service";

const baseURL = backendURL + "applicant";

export interface Applicant {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  roles: RoleWithoutApplicants[];
  avatar: boolean;
}

export interface ApplicantWithoutRoles {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  status: string;
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

export function getApplicant(id: string) {
  return fetch(baseURL + "/" + id);
}
