import { Types } from "mongoose";
import { Status } from "../../models/Applicant";

export interface NewApplicantRequestBodyForm {
  name: string;
  phoneNumber: string;
  email: string;
  avatar?: { buffer: Buffer; mimetype: string };
  roles?: { role: Types.ObjectId; status: Status }[];
}

export interface UpdateApplicantRequestBodyForm {
  name?: string;
  phoneNumber?: string;
  email?: string;
  avatar?: { buffer: Buffer; mimetype: string };
  roles?: { role: Types.ObjectId; status: Status }[];
}
