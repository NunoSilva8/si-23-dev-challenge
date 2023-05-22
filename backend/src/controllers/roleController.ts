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
    if (name != undefined) return await this.roleService.listRolesByName(name);
    else return await this.roleService.listAllRoles();
  }

  @Get("{roleID}")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async getRole(@Path() roleID: Types.ObjectId): Promise<RoleResponse> {
    return await this.roleService.getRole(roleID);
  }

  @Post("")
  @Response<Response409>(409, "Conflict")
  @SuccessResponse(200, "OK")
  public async createRole(
    @Body() body: NewRoleRequestBody
  ): Promise<RoleResponse> {
    return await this.getRole(
      (
        await this.roleService.createNew(body.name, body.applicants)
      )._id
    );
  }

  @Put("{roleID}")
  @Response<Response404>(404, "Not Found")
  @Response<Response409>(409, "Conflict")
  @SuccessResponse(200, "OK")
  public async updateRole(
    @Path() roleID: Types.ObjectId,
    @Body() body: UpdateRoleRequestBody
  ): Promise<RoleResponse> {
    return await this.roleService.updateRole(roleID, {
      name: body.name,
      applicants: body.applicants,
    });
  }

  @Delete("{roleID}")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async softDeleteRole(
    @Path() roleID: Types.ObjectId
  ): Promise<RoleResponse> {
    return await this.roleService.deleteRole(roleID);
  }
}
