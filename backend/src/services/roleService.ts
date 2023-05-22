import { Types } from "mongoose";
import { ErrorResponse } from "../interfaces/responses/error";
import { Applicant } from "../models/Applicant";
import { ApplicantRepository } from "../repositories/applicantRepository";
import { RoleRepository } from "../repositories/roleRepository";
import { Role } from "../models/Role";

export class RoleService {
  private roleRep = new RoleRepository();
  private applicantRep = new ApplicantRepository();

  private async syncApplicants(role: Role) {
    const oldApplicants = await this.applicantRep.findByRole(role._id);
    if (!oldApplicants) throw new ErrorResponse(500, "Server could not sync.");

    oldApplicants.forEach((applicant) => {
      this.applicantRep.remRole(applicant._id, role._id);
    });

    role.applicants.forEach((applicant) => {
      this.applicantRep.addRole(applicant._id, role._id);
    });
  }

  async createNew(name: string, applicants?: Types.ObjectId[]) {
    if (await this.roleRep.findOneByName(name))
      throw new ErrorResponse(
        409,
        `There is already a role registered with name: ${name}.`
      );

    const formatedApplicantList: Applicant[] = [];
    if (applicants != undefined) {
      let allApplicantsExist = true;
      await Promise.all(
        applicants.map(async (applicantID) => {
          const applicant = await this.applicantRep.findOneById(applicantID);
          if (applicant) formatedApplicantList.push(applicant);
          else allApplicantsExist = false;
        })
      );

      if (!allApplicantsExist)
        throw new ErrorResponse(409, "All applicants must exist.");
    }

    const newRole = await this.roleRep.insert(name, formatedApplicantList);
    if (!newRole) throw new ErrorResponse(500, "Server could not create.");

    this.syncApplicants(newRole);

    return newRole;
  }

  async listAllRoles() {
    const list = await this.roleRep.findAll();
    if (!list) return [];

    return list;
  }

  async listRolesByName(name: string) {
    const list = await this.roleRep.findByName(name);
    if (!list) return [];

    return list;
  }

  async getRole(id: Types.ObjectId) {
    const role = await this.roleRep.findOneById(id);
    if (!role) throw new ErrorResponse(404, `Role not Found`);

    return role;
  }

  async updateRole(
    id: Types.ObjectId,
    query: {
      name?: string;
      applicants?: Types.ObjectId[];
    }
  ) {
    if (!(await this.roleRep.findOneById(id)))
      throw new ErrorResponse(404, `Role not Found`);

    if (query.name && (await this.roleRep.findOneByName(query.name)))
      throw new ErrorResponse(
        409,
        `There is already a role registered with name: ${query.name}.`
      );

    const formatedApplicantList: Applicant[] = [];
    if (query.applicants) {
      let allApplicantsExist = true;
      await Promise.all(
        query.applicants.map(async (applicantID) => {
          const applicant = await this.applicantRep.findOneById(applicantID);
          if (applicant) formatedApplicantList.push(applicant);
          else allApplicantsExist = false;
        })
      );
      if (!allApplicantsExist) {
        throw new ErrorResponse(409, "All applicants must exist.");
      }
    }

    const newRole = await this.roleRep.update(id, {
      name: query.name,
      applicants: formatedApplicantList,
    });
    if (!newRole) throw new ErrorResponse(500, "Server could not update.");

    if (query.applicants) this.syncApplicants(newRole);

    return newRole;
  }

  async deleteRole(id: Types.ObjectId) {
    if (!(await this.roleRep.findOneById(id)))
      throw new ErrorResponse(404, `Role not Found`);

    const role = await this.roleRep.delete(id);
    if (!role) throw new ErrorResponse(500, "Server could not delete.");

    return role;
  }
}
