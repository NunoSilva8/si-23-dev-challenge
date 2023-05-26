import { Types } from "mongoose";
import { Applicant, ApplicantsModel, Status } from "../models/Applicant";
import { Role } from "../models/Role";

export class ApplicantRepository {
  async insertObject(data: {
    name: string;
    phoneNumber: string;
    email: string;
    avatar?: { buffer: Buffer; mimetype: string };
    roles?: { role: Role; status: Status }[];
    softDeleted?: boolean;
  }): Promise<Applicant | null> {
    return await (await ApplicantsModel.create(data))
      .populate("roles.role", "_id name")
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async insert(
    name: string,
    phoneNumber: string,
    email: string,
    avatar?: { buffer: Buffer; mimetype: string },
    roles?: { role: Role; status: Status }[],
    softDeleted?: boolean
  ): Promise<Applicant | null> {
    return this.insertObject({
      name,
      phoneNumber,
      email,
      avatar,
      roles,
      softDeleted,
    });
  }

  async findAll(): Promise<Applicant[] | null> {
    return await ApplicantsModel.find(
      { softDeleted: false },
      { softDeleted: 0, __v: 0, "roles._id": 0 }
    )
      .populate("roles.role", "_id name")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async findByName(name: string): Promise<Applicant[] | null> {
    return await ApplicantsModel.find(
      {
        name: { $regex: new RegExp(name, "i") },
        softDeleted: false,
      },
      { softDeleted: 0, __v: 0, "roles._id": 0 }
    )
      .populate("roles.role", "_id name")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async findOneById(id: Types.ObjectId): Promise<Applicant | null> {
    const applicant = await ApplicantsModel.findOne(
      { _id: id, softDeleted: false },
      { softDeleted: 0, __v: 0, "roles._id": 0 }
    )
      .populate("roles.role", "_id name")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (!applicant || applicant.softDeleted) return null;

    return applicant;
  }

  async findOneByEmail(email: string): Promise<Applicant | null> {
    return await ApplicantsModel.findOne(
      { email, softDeleted: false },
      { softDeleted: 0, __v: 0, "roles._id": 0 }
    )
      .populate("roles.role", "_id name")
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async findAvatarById(
    id: Types.ObjectId
  ): Promise<{ buffer: Buffer; mimetype: string } | null> {
    const applicant = await ApplicantsModel.findOne(
      { _id: id, softDeleted: false },
      { avatar: 1 }
    )
      .exec()
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (!applicant || !applicant.avatar || !applicant.avatar.mimetype)
      return null;

    return applicant.avatar;
  }

  async update(
    identifier: { id?: Types.ObjectId; email?: string },
    fields: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      avatar?: { buffer: Buffer; mimetype: string };
      roles?: { role: Role; status: Status }[];
    }
  ): Promise<Applicant | null> {
    if (fields.name == undefined) delete fields.name;
    if (fields.email == undefined) delete fields.email;
    if (fields.phoneNumber == undefined) delete fields.phoneNumber;
    if (fields.avatar == undefined) delete fields.avatar;
    if (fields.roles == undefined) delete fields.roles;

    if (identifier.id != undefined) {
      return await ApplicantsModel.findOneAndUpdate(
        { _id: identifier.id },
        fields,
        {
          new: true,
          populate: "roles.role",
          projection: { softDeleted: 0, avatar: 0, __v: 0 },
        }
      )
        .exec()
        .catch((err) => {
          console.error(err);
          return null;
        });
    } else if (identifier.email != undefined) {
      return await ApplicantsModel.findOneAndUpdate(
        { email: identifier.email },
        fields,
        {
          new: true,
          populate: "roles.role",
          projection: { softDeleted: 0, avatar: 0, __v: 0 },
        }
      )
        .exec()
        .catch((err) => {
          console.error(err);
          return null;
        });
    }

    return null;
  }

  async delete(identifier: {
    id?: Types.ObjectId;
    email?: string;
  }): Promise<Applicant | null> {
    if (identifier.id != undefined) {
      return await ApplicantsModel.findOneAndUpdate(
        { _id: identifier.id },
        {
          softDeleted: true,
        },
        {
          new: true,
          populate: "roles.role",
          projection: { softDeleted: 0, avatar: 0, __v: 0 },
        }
      )
        .exec()
        .catch((err) => {
          console.error(err);
          return null;
        });
    } else if (identifier.email != undefined) {
      return await ApplicantsModel.findOneAndUpdate(
        { email: identifier.email },
        { softDeleted: true },
        {
          new: true,
          populate: "roles.role",
          projection: { softDeleted: 0, avatar: 0, __v: 0 },
        }
      )
        .exec()
        .catch((err) => {
          console.error(err);
          return null;
        });
    }
    return null;
  }
}
