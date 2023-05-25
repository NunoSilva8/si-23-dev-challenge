import { Types } from "mongoose";
import * as express from "express";
import { ApplicantResponse } from "../interfaces/responses/applicant";
import { ApplicantService } from "../services/applicantService";
import {
  Controller,
  Route,
  Tags,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Path,
  SuccessResponse,
  Response,
  UploadedFile,
  FormField,
  ValidateError,
  Request,
} from "tsoa";
import {
  NewApplicantRequestBodyForm,
  UpdateApplicantRequestBodyForm,
} from "../interfaces/requests/applicant";
import { Status } from "../models/Applicant";
import { Response404, Response409 } from "../interfaces/responses/error";

@Route("api/applicant")
@Tags("Applicant Controller")
export class ApplicantController extends Controller {
  private applicantService = new ApplicantService();

  @Get("")
  @SuccessResponse(200, "OK")
  public async listApplicants(
    @Query() name?: string,
    @Query() email?: string
  ): Promise<ApplicantResponse[]> {
    let list: ApplicantResponse[] = [];
    if (name != undefined) {
      const notFormatedList = await this.applicantService.listApplicantsByName(
        name
      );
      list = notFormatedList.map((applicant) => {
        return {
          _id: applicant._id,
          name: applicant.name,
          phoneNumber: applicant.phoneNumber,
          email: applicant.email,
          status: applicant.status,
          roles: applicant.roles,
          avatar: applicant.avatar?.mimetype ? true : false,
        };
      });
    }
    if (email != undefined) {
      const applicant = await this.applicantService.getApplicant({ email });
      list = [
        {
          _id: applicant._id,
          name: applicant.name,
          phoneNumber: applicant.phoneNumber,
          email: applicant.email,
          status: applicant.status,
          roles: applicant.roles,
          avatar: applicant.avatar?.mimetype ? true : false,
        },
      ];
    }
    const notFormatedList = await this.applicantService.listAllApplicants();
    list = notFormatedList.map((applicant) => {
      return {
        _id: applicant._id,
        name: applicant.name,
        phoneNumber: applicant.phoneNumber,
        email: applicant.email,
        status: applicant.status,
        roles: applicant.roles,
        avatar: applicant.avatar?.mimetype ? true : false,
      };
    });

    return list;
  }

  @Get("{applicantID}")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async getApplicant(
    @Path() applicantID: Types.ObjectId
  ): Promise<ApplicantResponse> {
    const applicant = await this.applicantService.getApplicant({
      id: applicantID,
    });
    return {
      _id: applicant._id,
      name: applicant.name,
      phoneNumber: applicant.phoneNumber,
      email: applicant.email,
      status: applicant.status,
      roles: applicant.roles,
      avatar: applicant.avatar?.mimetype ? true : false,
    };
  }

  @Get("{applicantID}/avatar")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async getApplicantAvatar(
    @Request() request: express.Request,
    @Path() applicantID: Types.ObjectId
  ) {
    const avatar = await this.applicantService.getApplicantAvatar(applicantID);
    const res = request.res;

    res?.set("Content-Type", avatar.mimetype);
    res?.send(avatar.buffer);
  }

  @Post("")
  @Response<Response409>(409, "Conflict")
  @SuccessResponse(200, "OK")
  public async createApplicant(
    @FormField() name: string,
    @FormField() phoneNumber: string,
    @FormField() email: string,
    @FormField() status: string,
    @UploadedFile() avatar?: Express.Multer.File,
    @FormField() roles?: string
  ): Promise<ApplicantResponse> {
    // Verify Status
    status = status.toUpperCase();
    if (
      !(
        status === "APPROVED" ||
        status === "REJECTED" ||
        status === "UNDER ANALYSIS"
      )
    ) {
      throw new ValidateError(
        {
          query: {
            message:
              'Field "status" does not match any of the possible values: ["APPROVED","REJECTED","UNDER ANALYSIS"]',
            value: {
              status,
            },
          },
        },
        ""
      );
    }

    // Verify Roles
    const formatedRoleList: Types.ObjectId[] = [];
    if (roles != undefined) {
      try {
        const parsedRoles = JSON.parse(roles);

        if (!Array.isArray(parsedRoles)) {
          throw new ValidateError(
            {
              query: {
                message:
                  '"roles" is not an array. Please use JSON.stringify() to send this field.',
                value: parsedRoles,
              },
            },
            ""
          );
        }

        parsedRoles.forEach((elem, index) => {
          if (!Types.ObjectId.isValid(elem)) {
            throw new ValidateError(
              {
                query: {
                  message:
                    'Elements in "roles" are not valid. Please use JSON.stringify() to send this field.',
                  value: { index, value: elem },
                },
              },
              ""
            );
          }
          formatedRoleList.push(new Types.ObjectId(elem));
        });
      } catch (err) {
        throw new ValidateError(
          {
            query: {
              message:
                'Server cannot JSON.parse() the field "roles". Please use JSON.stringify() to send this field.',
              value: roles,
            },
          },
          ""
        );
      }
    }

    let formatedInput: NewApplicantRequestBodyForm;
    try {
      formatedInput = {
        name: JSON.parse(name),
        phoneNumber: JSON.parse(phoneNumber),
        email: JSON.parse(email),
        status: status as Status,
        avatar: avatar
          ? { buffer: avatar.buffer, mimetype: avatar.mimetype }
          : undefined,
        roles: formatedRoleList,
      };
    } catch (err) {
      throw new ValidateError(
        {
          query: {
            message:
              'Server cannot JSON.parse() one or more of the following fields: ["name", "phoneNumber", "email"]. Please use JSON.stringify() to send this fields.',
            value: {
              name,
              phoneNumber,
              email,
            },
          },
        },
        ""
      );
    }

    return this.getApplicant(
      (
        await this.applicantService.createNew(
          formatedInput.name,
          formatedInput.phoneNumber,
          formatedInput.email,
          formatedInput.avatar,
          formatedInput.status,
          formatedInput.roles
        )
      )._id
    );
  }

  @Put("{applicantID}")
  @Response<Response404>(404, "Not Found")
  @Response<Response409>(409, "Conflict")
  @SuccessResponse(200, "OK")
  public async updateApplicant(
    @Path() applicantID: Types.ObjectId,
    @FormField() name?: string,
    @FormField() phoneNumber?: string,
    @FormField() email?: string,
    @FormField() status?: string,
    @UploadedFile() avatar?: Express.Multer.File,
    @FormField() roles?: string
  ): Promise<ApplicantResponse> {
    // Verify Status
    if (status != undefined) {
      status = status.toUpperCase();
      if (
        !(
          status === "APPROVED" ||
          status === "REJECTED" ||
          status === "UNDER ANALYSIS"
        )
      ) {
        throw new ValidateError(
          {
            query: {
              message:
                'Field "status" does not match any of the possible values: ["APPROVED","REJECTED","UNDER ANALYSIS"]',
              value: {
                status,
              },
            },
          },
          ""
        );
      }
    }

    // Verify Roles
    const formatedRoleList: Types.ObjectId[] = [];
    if (roles != undefined) {
      try {
        const parsedRoles = JSON.parse(roles);

        if (!Array.isArray(parsedRoles)) {
          throw new ValidateError(
            {
              query: {
                message:
                  '"roles" is not an array. Please use JSON.stringify() to send this field.',
                value: parsedRoles,
              },
            },
            ""
          );
        }

        parsedRoles.forEach((elem, index) => {
          if (!Types.ObjectId.isValid(elem)) {
            throw new ValidateError(
              {
                query: {
                  message:
                    'Elements in "roles" are not valid. Please use JSON.stringify() to send this field.',
                  value: { index, value: elem },
                },
              },
              ""
            );
          }
          formatedRoleList.push(new Types.ObjectId(elem));
        });
      } catch (err) {
        throw new ValidateError(
          {
            query: {
              message:
                'Server cannot JSON.parse() the field "roles". Please use JSON.stringify() to send this field.',
              value: roles,
            },
          },
          ""
        );
      }
    }

    let formatedInput: UpdateApplicantRequestBodyForm;
    try {
      formatedInput = {
        name: name != undefined ? JSON.parse(name) : undefined,
        phoneNumber:
          phoneNumber != undefined ? JSON.parse(phoneNumber) : undefined,
        email: email != undefined ? JSON.parse(email) : undefined,
        status: status != undefined ? (status as Status) : undefined,
        avatar: avatar
          ? { buffer: avatar.buffer, mimetype: avatar.mimetype }
          : undefined,
        roles: roles != undefined ? formatedRoleList : undefined,
      };
    } catch (err) {
      throw new ValidateError(
        {
          query: {
            message:
              'Server cannot JSON.parse() one or more of the following fields: ["name", "phoneNumber", "email"]. Please use JSON.stringify() to send this fields.',
            value: {
              name,
              phoneNumber,
              email,
            },
          },
        },
        ""
      );
    }

    const applicant = await this.applicantService.update(
      applicantID,
      formatedInput
    );
    return {
      _id: applicant._id,
      name: applicant.name,
      phoneNumber: applicant.phoneNumber,
      email: applicant.email,
      status: applicant.status,
      roles: applicant.roles,
      avatar: applicant.avatar?.mimetype ? true : false,
    };
  }

  @Delete("{applicantID}")
  @Response<Response404>(404, "Not Found")
  @SuccessResponse(200, "OK")
  public async softDeleteApplicant(
    @Path() applicantID: Types.ObjectId
  ): Promise<ApplicantResponse> {
    const applicant = await this.applicantService.delete(applicantID);
    return {
      _id: applicant._id,
      name: applicant.name,
      phoneNumber: applicant.phoneNumber,
      email: applicant.email,
      status: applicant.status,
      roles: applicant.roles,
      avatar: applicant.avatar?.mimetype ? true : false,
    };
  }
}
