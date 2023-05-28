import { Types } from "mongoose";
import { ErrorResponse } from "../interfaces/responses/error";
import { ApplicantRepository } from "../repositories/applicantRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { Role } from "../models/Role";
import { Status } from "../models/Applicant";

export class ApplicantService {
  private roleRep = new RoleRepository();
  private applicantRep = new ApplicantRepository();

  async createNew(
    name: string,
    phoneNumber: string,
    email: string,
    avatar?: { buffer: Buffer; mimetype: string },
    roles?: { role: Types.ObjectId; status: Status }[]
  ) {
    if (await this.applicantRep.findOneByEmail(email))
      throw new ErrorResponse(
        409,
        `There is already an applicant registered with email: ${email}.`
      );

    const formatedRoleList: { role: Role; status: Status }[] = [];
    if (roles != undefined) {
      let allRolesExist = true;
      await Promise.all(
        roles.map(async (elem) => {
          const roleObj = await this.roleRep.findOneById(elem.role);
          if (roleObj)
            formatedRoleList.push({ role: roleObj, status: elem.status });
          else allRolesExist = false;
        })
      );

      if (!allRolesExist) throw new ErrorResponse(409, "All roles must exist.");
    }
    const newApplicant = await this.applicantRep.insert(
      name,
      phoneNumber,
      email,
      avatar,
      formatedRoleList
    );

    if (!newApplicant) throw new ErrorResponse(500, "Server could not create.");

    Promise.all(
      newApplicant.roles.map(async (elem) => {
        const role = await this.roleRep.findOneById(elem.role._id);
        if (!role) throw new ErrorResponse(500, "Server could not sync roles.");

        let applicantsList = role.applicants;
        applicantsList.push(newApplicant);

        await this.roleRep.update(role._id, { applicants: applicantsList });
      })
    );

    return newApplicant;
  }

  async listAllApplicants() {
    const list = await this.applicantRep.findAll();
    if (!list) return [];

    return list;
  }

  async listApplicantsByName(name: string) {
    const list = await this.applicantRep.findByName(name);
    if (!list) return [];

    return list;
  }

  async getApplicant(query: { id?: Types.ObjectId; email?: string }) {
    if (query.id) {
      const applicant = await this.applicantRep.findOneById(query.id);
      if (applicant) return applicant;
    }
    if (query.email) {
      const applicant = await this.applicantRep.findOneByEmail(query.email);
      if (applicant) return applicant;
    }
    throw new ErrorResponse(404, `Applicant not Found`);
  }

  async getApplicantAvatar(id: Types.ObjectId) {
    const avatar = await this.applicantRep.findAvatarById(id);
    if (!avatar) throw new ErrorResponse(404, `Avatar not Found`);

    return avatar;
  }

  async update(
    id: Types.ObjectId,
    query: {
      name?: string;
      phoneNumber?: string;
      email?: string;
      avatar?: { buffer: Buffer; mimetype: string };
      roles?: { role: Types.ObjectId; status: Status }[];
    }
  ) {
    const oldApplicant = await this.applicantRep.findOneById(id);
    if (!oldApplicant) throw new ErrorResponse(404, `Applicant not Found`);

    if (query.email) {
      const isEmailGood = await this.applicantRep.findOneByEmail(query.email);
      if (query.email == isEmailGood?.email && id != isEmailGood._id)
        throw new ErrorResponse(
          409,
          `There is already an applicant registered with email: ${query.email}.`
        );
    }

    const formatedRoleList: { role: Role; status: Status }[] = [];
    if (query.roles != undefined) {
      let allRolesExist = true;
      await Promise.all(
        query.roles.map(async (elem) => {
          const roleObj = await this.roleRep.findOneById(elem.role);
          if (roleObj)
            formatedRoleList.push({ role: roleObj, status: elem.status });
          else {
            allRolesExist = false;
          }
        })
      );

      if (!allRolesExist) throw new ErrorResponse(409, "All roles must exist.");
    }

    const newApplicant = await this.applicantRep.update(
      { id },
      {
        name: query.name,
        email: query.email,
        phoneNumber: query.phoneNumber,
        avatar: query.avatar,
        roles: query.roles ? formatedRoleList : undefined,
      }
    );

    if (!newApplicant) throw new ErrorResponse(500, "Server could not update.");

    await Promise.all(
      oldApplicant.roles.map(async (elem) => {
        const role = await this.roleRep.findOneById(elem.role._id);
        if (!role) throw new ErrorResponse(500, "Server could not sync roles.");

        let applicantsList = role.applicants;
        applicantsList = applicantsList.filter(
          (applicant) => applicant._id.toString() != oldApplicant._id.toString()
        );

        await this.roleRep.update(role._id, { applicants: applicantsList });
      })
    );

    await Promise.all(
      newApplicant.roles.map(async (elem) => {
        const role = await this.roleRep.findOneById(elem.role._id);
        if (!role) throw new ErrorResponse(500, "Server could not sync roles.");

        let applicantsList = role.applicants;
        applicantsList.push(newApplicant);

        await this.roleRep.update(role._id, { applicants: applicantsList });
      })
    );

    return newApplicant;
  }

  async delete(id: Types.ObjectId) {
    if (!(await this.applicantRep.findOneById(id)))
      throw new ErrorResponse(404, `Applicant not Found`);

    const applicant = await this.applicantRep.delete({ id });
    if (!applicant) throw new ErrorResponse(500, "Server could not delete.");

    return applicant;
  }
}
