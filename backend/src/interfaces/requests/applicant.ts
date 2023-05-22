import { Types } from "mongoose";
import { Status } from "../../models/Applicant";

export interface NewApplicantRequestBodyForm {
  name: string;
  phoneNumber: string;
  email: string;
  status: Status;
  avatar?: { buffer: Buffer; mimetype: string };
  roles?: Types.ObjectId[];
}

export interface UpdateApplicantRequestBodyForm {
  name?: string;
  phoneNumber?: string;
  email?: string;
  status?: Status;
  avatar?: { buffer: Buffer; mimetype: string };
  roles?: Types.ObjectId[];
}
