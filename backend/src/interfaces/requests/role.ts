import { Types } from "mongoose";

export interface NewRoleRequestBody {
  name: string;
  applicants?: Types.ObjectId[];
}

export interface UpdateRoleRequestBody {
  name?: string;
  applicants?: Types.ObjectId[];
}
