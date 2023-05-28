import { Types } from "mongoose";
import { RoleService } from "../services/roleService";
import {
  Controller,
  Route,
  Tags,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Path,
  SuccessResponse,
  Response,
} from "tsoa";
import { Response404, Response409 } from "../interfaces/responses/error";
import { RoleResponse } from "../interfaces/responses/role";
import {
  NewRoleRequestBody,
  UpdateRoleRequestBody,
} from "../interfaces/requests/role";

@Route("api/role")
@Tags("Role Controller")
export class RoleController extends Controller {
  private roleService = new RoleService();

  @Get("")
  @SuccessResponse(200, "OK")
  public async listRoles(@Query() name?: string): Promise<RoleResponse[]> {
    let list: RoleResponse[] = [];
    if (name != undefined) {
      const nonFormatedList = await this.roleService.listRolesByName(name);
      list = nonFormatedList.map((role) => {
        return {
          _id: role._id,
          name: role.name,
          applicants: role.applicants
            .map((applicant) => {
              return {
                _id: applicant._id,
                name: applicant.name,
                phoneNumber: applicant.phoneNumber,
                email: applicant.email,
                status:
                  applicant.roles[
                    applicant.roles.findIndex(
                      (elem) =>
                        (<Types.ObjectId>(<unknown>elem.role)).toString() ==
                        role._id.toString()
                    )
                  ].status,
                avatar: applicant.avatar?.mimetype ? true : false,
                softDeleted: applicant.softDeleted,
              };
            })
            .filter((applicant) => applicant.softDeleted == false)
            .map((applicant) => ({
              _id: applicant._id,
              name: applicant.name,
              phoneNumber: applicant.phoneNumber,
              email: applicant.email,
              status: applicant.status,
              avatar: applicant.avatar,
            })),
        };
      });
    } else {
      const nonFormatedList = await this.roleService.listAllRoles();
      list = nonFormatedList.map((role) => {
        return {
          _id: role._id,
          name: role.name,
          applicants: role.applicants
            .map((applicant) => {
              return {
                _id: applicant._id,
                name: applicant.name,
                phoneNumber: applicant.phoneNumber,
                email: applicant.email,
                status:
                  applicant.roles[
                    applicant.roles.findIndex(
                      (elem) =>
                        (<Types.ObjectId>(<unknown>elem.role)).toString() ==
                        role._id.toString()
                    )
                  ].status,
                avatar: applicant.avatar?.mimetype ? true : false,
                softDeleted: applicant.softDeleted,
              };
            })
            .filter((applicant) => applicant.softDeleted == false)
            .map((applicant) => ({
              _id: applicant._id,
              name: applicant.name,
              phoneNumber: applicant.phoneNumber,
              email: applicant.email,
              status: applicant.status,
              avatar: applicant.avatar,
            })),
        };
      });
    }
    return list;
  }

  @Get("{roleID}")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async getRole(@Path() roleID: Types.ObjectId): Promise<RoleResponse> {
    const role = await this.roleService.getRole(roleID);
    return {
      _id: role._id,
      name: role.name,
      applicants: role.applicants
        .map((applicant) => {
          return {
            _id: applicant._id,
            name: applicant.name,
            phoneNumber: applicant.phoneNumber,
            email: applicant.email,
            status:
              applicant.roles[
                applicant.roles.findIndex(
                  (elem) =>
                    (<Types.ObjectId>(<unknown>elem.role)).toString() ==
                    role._id.toString()
                )
              ].status,
            avatar: applicant.avatar?.mimetype ? true : false,
            softDeleted: applicant.softDeleted,
          };
        })
        .filter((applicant) => applicant.softDeleted == false)
        .map((applicant) => ({
          _id: applicant._id,
          name: applicant.name,
          phoneNumber: applicant.phoneNumber,
          email: applicant.email,
          status: applicant.status,
          avatar: applicant.avatar,
        })),
    };
  }

  @Post("")
  @Response<Response409>(409, "Conflict")
  @SuccessResponse(200, "OK")
  public async createRole(
    @Body() body: NewRoleRequestBody
  ): Promise<RoleResponse> {
    const role = await this.roleService.createNew(body.name, body.applicants);
    return {
      _id: role._id,
      name: role.name,
      applicants: role.applicants
        .map((applicant) => {
          return {
            _id: applicant._id,
            name: applicant.name,
            phoneNumber: applicant.phoneNumber,
            email: applicant.email,
            status:
              applicant.roles[
                applicant.roles.findIndex(
                  (elem) =>
                    (<Types.ObjectId>(<unknown>elem.role)).toString() ==
                    role._id.toString()
                )
              ].status,
            avatar: applicant.avatar?.mimetype ? true : false,
            softDeleted: applicant.softDeleted,
          };
        })
        .filter((applicant) => applicant.softDeleted == false)
        .map((applicant) => ({
          _id: applicant._id,
          name: applicant.name,
          phoneNumber: applicant.phoneNumber,
          email: applicant.email,
          status: applicant.status,
          avatar: applicant.avatar,
        })),
    };
  }

  @Put("{roleID}")
  @Response<Response404>(404, "Not Found")
  @Response<Response409>(409, "Conflict")
  @SuccessResponse(200, "OK")
  public async updateRole(
    @Path() roleID: Types.ObjectId,
    @Body() body: UpdateRoleRequestBody
  ): Promise<RoleResponse> {
    const role = await this.roleService.updateRole(roleID, {
      name: body.name,
      applicants: body.applicants,
    });
    return {
      _id: role._id,
      name: role.name,
      applicants: role.applicants
        .map((applicant) => {
          return {
            _id: applicant._id,
            name: applicant.name,
            phoneNumber: applicant.phoneNumber,
            email: applicant.email,
            status:
              applicant.roles[
                applicant.roles.findIndex(
                  (elem) =>
                    (<Types.ObjectId>(<unknown>elem.role)).toString() ==
                    role._id.toString()
                )
              ].status,
            avatar: applicant.avatar?.mimetype ? true : false,
            softDeleted: applicant.softDeleted,
          };
        })
        .filter((applicant) => applicant.softDeleted == false)
        .map((applicant) => ({
          _id: applicant._id,
          name: applicant.name,
          phoneNumber: applicant.phoneNumber,
          email: applicant.email,
          status: applicant.status,
          avatar: applicant.avatar,
        })),
    };
  }

  @Delete("{roleID}")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async softDeleteRole(
    @Path() roleID: Types.ObjectId
  ): Promise<RoleResponse> {
    const role = await this.roleService.deleteRole(roleID);
    return {
      _id: role._id,
      name: role.name,
      applicants: role.applicants
        .map((applicant) => {
          return {
            _id: applicant._id,
            name: applicant.name,
            phoneNumber: applicant.phoneNumber,
            email: applicant.email,
            status:
              applicant.roles[
                applicant.roles.findIndex(
                  (elem) =>
                    (<Types.ObjectId>(<unknown>elem.role)).toString() ==
                    role._id.toString()
                )
              ].status,
            avatar: applicant.avatar?.mimetype ? true : false,
            softDeleted: applicant.softDeleted,
          };
        })
        .filter((applicant) => applicant.softDeleted == false)
        .map((applicant) => ({
          _id: applicant._id,
          name: applicant.name,
          phoneNumber: applicant.phoneNumber,
          email: applicant.email,
          status: applicant.status,
          avatar: applicant.avatar,
        })),
    };
  }
}
