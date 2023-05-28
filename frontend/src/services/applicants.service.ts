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

export function createApplicant(
  name: string,
  email: string,
  phoneNumber: string,
  avatar?: File,
  roles?: { role: string; status: string }[]
) {
  const form = new FormData();
  form.append("name", JSON.stringify(name));
  form.append("email", JSON.stringify(email));
  form.append("phoneNumber", JSON.stringify(phoneNumber));
  if (avatar != undefined) form.append("avatar", avatar);
  if (roles != undefined) form.append("roles", JSON.stringify(roles));

  return fetch(baseURL, { method: "post", body: form });
}

export function updateApplicant(
  id: string,
  name?: string,
  email?: string,
  phoneNumber?: string,
  avatar?: File,
  roles?: { role: string; status: string }[]
) {
  const form = new FormData();
  if (name != undefined) form.append("name", JSON.stringify(name));
  if (email != undefined) form.append("email", JSON.stringify(email));
  if (phoneNumber != undefined)
    form.append("phoneNumber", JSON.stringify(phoneNumber));
  if (avatar != undefined) form.append("avatar", avatar);
  if (roles != undefined) form.append("roles", JSON.stringify(roles));

  return fetch(baseURL + "/" + id, { method: "put", body: form });
}

export function deleteApplicant(id: string) {
  return fetch(baseURL + "/" + id, { method: "delete" });
}
