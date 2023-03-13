import {
  ExceptionFilter, Catch,
  ArgumentsHost, Logger, HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import { isString, KError } from '@error/error.handler';

function convertPrettyKST(time: string | number | Date, simple?: boolean): string {
  const dateObj = new Date(time);
  const date = `0${dateObj.getDate()}`.slice(-2);
  const month = `0${dateObj.getMonth() + 1}`.slice(-2);
  const year = dateObj.getFullYear();
  const hour = `0${dateObj.getHours()}`.slice(-2);
  const minute = `0${dateObj.getMinutes()}`.slice(-2);
  const second = `0${dateObj.getSeconds()}`.slice(-2);
  if (simple) {
    return `${year}${month}${date}_${hour}${minute}${second}`;
  }
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}

// NOTE : CATCH ERROR AND FILTER IT TO GENERALIZED RESPONSE!
@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus ? exception.getStatus() : 400;

    let err: string = '';
    let msg: string = '';
    let ext: object = {};

    if (exception instanceof HttpException) {
      if (isString(exception.getResponse())) {
        console.log(exception);
        err = exception.getResponse() as string;
        msg = (exception.getResponse() as string !== exception.message) ? exception.message : '';
        ext = {};
      } else if (exception instanceof KError){
        console.log(exception);
        err = isString(exception.getResponse()) ? exception.getResponse() : (exception.getResponse() as any).error || exception.message;
        msg = isString(exception.getResponse()) ? exception.getResponse() : (exception.getResponse() as any).message || exception.message;
        ext = exception.getExtraInfo();
      } else {
        err = `${exception.getResponse()}`;
        msg = exception.message;
        ext = {};
      }

    }
    const exceptionExtraInfo: object = Object.assign(
      ext,
      {
        timestamp: convertPrettyKST(new Date()),
        path: request.url,
      }
    )

    const responseBody = {
      err,
      msg,
      ext: exceptionExtraInfo,
    };

    Logger.error(
      '\n======================= ERROR : =======================\n'
        + `[${status}]\n`
        + `\n${JSON.stringify(responseBody, null, 2)}\n`
        + '===================== End ERROR =======================\n\n'
    );
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}

export default GlobalExceptionFilter;
