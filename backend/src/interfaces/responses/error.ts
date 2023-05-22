import { Exception, FieldErrors } from "tsoa";

export class ErrorResponse extends Error implements Exception {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface Response404 {
  message: string;
}

export interface Response409 {
  message: string;
}

export interface Response422 {
  message: string;
  details: FieldErrors;
}
