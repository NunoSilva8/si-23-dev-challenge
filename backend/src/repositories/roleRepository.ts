import { Types } from "mongoose";
import { Applicant } from "../models/Applicant";
import { Role, RolesModel } from "../models/Role";

export class RoleRepository {
  async insertObject(data: {
    name: string;
    applicants?: Applicant[];
    softDeleted?: boolean;
  }): Promise<Role | null> {
    return await (await RolesModel.create(data))
      .populate("applicants")
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async insert(
    name: string,
    applicants?: Applicant[],
    softDeleted?: boolean
  ): Promise<Role | null> {
    return this.insertObject({ name, applicants, softDeleted });
  }

  async findAll(): Promise<Role[] | null> {
    return await RolesModel.find(
      { softDeleted: false },
      { softDeleted: 0, __v: 0 }
    )
      .populate("applicants")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async findByName(name: string): Promise<Role[] | null> {
    return await RolesModel.find(
      {
        name: { $regex: new RegExp(name, "i") },
        softDeleted: false,
      },
      { softDeleted: 0, __v: 0 }
    )
      .populate("applicants")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async findOneByName(name: string): Promise<Role | null> {
    const role = await RolesModel.findOne({ name }, { softDeleted: 0, __v: 0 })
      .populate("applicants")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (!role || role.softDeleted) return null;

    return role;
  }

  async findOneById(id: Types.ObjectId): Promise<Role | null> {
    const role = await RolesModel.findOne(
      { _id: id, softDeleted: false },
      { softDeleted: 0, __v: 0 }
    )
      .populate("applicants")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (!role) return null;

    return role;
  }

  async update(
    id: Types.ObjectId,
    query: {
      name?: string;
      applicants?: Applicant[];
    }
  ): Promise<Role | null> {
    if (query.applicants == undefined) delete query.applicants;
    if (query.name == undefined) delete query.name;

    return await RolesModel.findOneAndUpdate(
      { _id: id, softDeleted: false },
      query,
      {
        new: true,
        populate: "applicants",
      }
    )
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async delete(id: Types.ObjectId): Promise<Role | null> {
    return await RolesModel.findOneAndUpdate(
      { _id: id, softDeleted: false },
      { softDeleted: true },
      {
        new: true,
        populate: "applicants",
      }
    )
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
}
