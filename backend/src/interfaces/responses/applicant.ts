import { Types } from "mongoose";
import { Status } from "../../models/Applicant";
import { RoleWithoutApplicants } from "./role";

export interface ApplicantWithoutRoles {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: string;
  email: string;
  status: Status;
  avatar: boolean;
}

export interface ApplicantResponse {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: string;
  email: string;
  status: Status;
  roles: RoleWithoutApplicants[];
  avatar: boolean;
}
