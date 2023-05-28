import { backendURL } from "../utils/config.json";
import { ApplicantWithoutRoles } from "./applicants.service";

const baseURL = backendURL + "role";

export interface Role {
  _id: string;
  name: string;
  applicants: ApplicantWithoutRoles[];
}

export interface RoleWithoutApplicants {
  role: { _id: string; name: string };
  status: string;
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

export function getRole(id: string) {
  return fetch(baseURL + "/" + id);
}

export function createRole(
  name: string,
  applicants?: { applicant: string; status: string }[]
) {
  const body = { name, applicants };
  return fetch(baseURL, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateRole(
  id: string,
  name?: string,
  applicants?: { applicant: string; status: string }[]
) {
  const body = { name, applicants };
  return fetch(baseURL + "/" + id, {
    method: "put",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

export function deleteRole(id: string) {
  return fetch(baseURL + "/" + id, {
    method: "delete",
  });
}
