import { Types } from "mongoose";
import { ErrorResponse } from "../interfaces/responses/error";
import { Applicant } from "../models/Applicant";
import { RoleRepository } from "../repositories/roleRepository";

export class RoleService {
  private roleRep = new RoleRepository();

  async createNew(name: string) {
    if (await this.roleRep.findOneByName(name))
      throw new ErrorResponse(
        409,
        `There is already a role registered with name: ${name}.`
      );

    const newRole = await this.roleRep.insert(name, []);
    if (!newRole) throw new ErrorResponse(500, "Server could not create.");

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

    const newRole = await this.roleRep.update(id, {
      name: query.name,
      applicants: formatedApplicantList,
    });
    if (!newRole) throw new ErrorResponse(500, "Server could not update.");

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
