import { Types } from "mongoose";
import { ErrorResponse } from "../interfaces/responses/error";
import { ApplicantRepository } from "../repositories/applicantRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { Role } from "../models/Role";
import { Applicant, Status } from "../models/Applicant";

export class ApplicantService {
  private roleRep = new RoleRepository();
  private applicantRep = new ApplicantRepository();

  private async syncRoles(applicant: Applicant) {
    const oldRoles = await this.roleRep.findByApplicant(applicant._id);
    if (!oldRoles) throw new ErrorResponse(500, "Server could not sync.");

    oldRoles.forEach((role) => {
      this.roleRep.remApplicant(role._id, applicant._id);
    });

    applicant.roles.forEach((role) => {
      this.roleRep.addApplicant(role._id, applicant._id);
    });
  }

  async createNew(
    name: string,
    phoneNumber: string,
    email: string,
    avatar?: { buffer: Buffer; mimetype: string },
    status?: Status,
    roles?: Types.ObjectId[]
  ) {
    if (await this.applicantRep.findOneByEmail(email))
      throw new ErrorResponse(
        409,
        `There is already an applicant registered with email: ${email}.`
      );

    const formatedRoleList: Role[] = [];
    if (roles != undefined) {
      let allRolesExist = true;
      await Promise.all(
        roles.map(async (roleID) => {
          const role = await this.roleRep.findOneById(roleID);
          if (role) formatedRoleList.push(role);
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
      status,
      formatedRoleList
    );

    if (!newApplicant) throw new ErrorResponse(500, "Server could not create.");

    this.syncRoles(newApplicant);

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
      status?: Status;
      roles?: Types.ObjectId[];
    }
  ) {
    if (!(await this.applicantRep.findOneById(id)))
      throw new ErrorResponse(404, `Applicant not Found`);

    if (query.email && (await this.applicantRep.findOneByEmail(query.email)))
      throw new ErrorResponse(
        409,
        `There is already an applicant registered with email: ${query.email}.`
      );

    const formatedRoleList: Role[] = [];
    if (query.roles != undefined) {
      let allRolesExist = true;
      await Promise.all(
        query.roles.map(async (roleID) => {
          const role = await this.roleRep.findOneById(roleID);
          if (role) formatedRoleList.push(role);
          else allRolesExist = false;
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
        status: query.status,
        roles: query.roles ? formatedRoleList : undefined,
      }
    );

    if (!newApplicant) throw new ErrorResponse(500, "Server could not update.");

    if (query.roles) this.syncRoles(newApplicant);

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
