import { Types } from "mongoose";
import { ErrorResponse } from "../interfaces/responses/error";
import { Applicant, Status } from "../models/Applicant";
import { RoleRepository } from "../repositories/roleRepository";
import { ApplicantRepository } from "../repositories/applicantRepository";

export class RoleService {
  private roleRep = new RoleRepository();
  private applicantRep = new ApplicantRepository();

  async createNew(
    name: string,
    applicants?: { applicant: Types.ObjectId; status: Status }[]
  ) {
    if (await this.roleRep.findOneByName(name))
      throw new ErrorResponse(
        409,
        `There is already a role registered with name: ${name}.`
      );

    const applicantsList: Applicant[] = [];
    if (applicants != undefined) {
      await Promise.all(
        applicants.map(async (bigApplicant) => {
          const applicant = await this.applicantRep.findOneById(
            bigApplicant.applicant
          );
          if (!applicant) throw new ErrorResponse(404, `Invalid Applicant`);
          applicantsList.push(applicant);
        })
      );
    }

    const newRole = await this.roleRep.insert(name, applicantsList);
    if (!newRole) throw new ErrorResponse(500, "Server could not create.");
    else {
      if (applicants != undefined) {
        await Promise.all(
          applicantsList.map(async (applicant, index) => {
            await this.applicantRep.update(
              { id: applicant._id },
              {
                roles: [
                  ...applicant.roles,
                  { role: newRole, status: applicants[index].status },
                ],
              }
            );
          })
        );
      }

      return this.getRole(newRole._id);
    }
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
      applicants?: { applicant: Types.ObjectId; status: Status }[];
    }
  ) {
    const oldRole = await this.roleRep.findOneById(id);
    if (!oldRole) throw new ErrorResponse(404, `Role not Found`);

    if (query.name) {
      const isNameGood = await this.roleRep.findOneByName(query.name);
      if (query.name == isNameGood?.name && id != isNameGood._id)
        throw new ErrorResponse(
          409,
          `There is already a role registered with name: ${query.name}.`
        );
    }

    let formatedApplicantList: Applicant[] = [];
    if (query.applicants != undefined) {
      await Promise.all(
        query.applicants.map(async (bigApplicant) => {
          const applicant = await this.applicantRep.findOneById(
            bigApplicant.applicant
          );
          if (!applicant) throw new ErrorResponse(404, `Invalid Applicant`);

          formatedApplicantList.push(applicant);
        })
      );
    }

    const newRole = await this.roleRep.update(id, {
      name: query.name,
      applicants: query.applicants ? formatedApplicantList : undefined,
    });
    if (!newRole) throw new ErrorResponse(500, "Server could not update.");
    else {
      if (query.applicants != undefined) {
        await Promise.all(
          oldRole.applicants.map(async (applicant) => {
            let fullApplicant = await this.applicantRep.findOneById(
              applicant._id
            );
            if (!fullApplicant)
              throw new ErrorResponse(500, "Server could not sync applicants.");

            if (query.applicants) {
              let roleList = [...fullApplicant.roles];

              roleList = roleList.filter((bigRole) => {
                return bigRole.role._id.toString() != oldRole._id.toString();
              });

              await this.applicantRep.update(
                { id: fullApplicant._id },
                { roles: roleList }
              );
            }
          })
        );

        await Promise.all(
          newRole.applicants.map(async (applicant, index) => {
            let fullApplicant = await this.applicantRep.findOneById(
              applicant._id
            );
            if (!fullApplicant)
              throw new ErrorResponse(500, "Server could not sync applicants.");

            if (query.applicants) {
              let roleList = [...fullApplicant.roles];

              roleList.push({
                role: newRole,
                status: query.applicants[index].status,
              });

              await this.applicantRep.update(
                { id: fullApplicant._id },
                { roles: roleList }
              );
            }
          })
        );
      }

      return newRole;
    }
  }

  async deleteRole(id: Types.ObjectId) {
    if (!(await this.roleRep.findOneById(id)))
      throw new ErrorResponse(404, `Role not Found`);

    const role = await this.roleRep.delete(id);
    if (!role) throw new ErrorResponse(500, "Server could not delete.");

    return role;
  }
}
