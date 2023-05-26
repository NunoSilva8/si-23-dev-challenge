import { backendURL } from "../utils/config.json";
import { ApplicantWithoutRoles } from "./applicants.service";

const baseURL = backendURL + "role";

export interface Role {
  _id: string;
  name: string;
  applicants: ApplicantWithoutRoles[];
}

export interface RoleWithoutApplicants {
  _id: string;
  name: string;
}

export function getRolesList(queryParams?: { name?: string }) {
  if (queryParams?.name) {
    return fetch(
      baseURL + "?" + new URLSearchParams({ name: queryParams.name })
    );
  } else {
    return fetch(baseURL);
  }
}
