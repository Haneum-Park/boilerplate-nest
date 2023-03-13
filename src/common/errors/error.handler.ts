// NOTE : Custom Error Handler By Dogyun
import { HttpException, HttpStatus } from "@nestjs/common";

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';
export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === 'object';
export const validatePath = (path?: string): string =>
  path ? (path.charAt(0) !== '/' ? '/' + path : path) : '';
export const isFunction = (fn: any): boolean => typeof fn === 'function';
export const isString = (fn: any): fn is string => typeof fn === 'string';
export const isConstructor = (fn: any): boolean => fn === 'constructor';
export const isNil = (obj: any): boolean => isUndefined(obj) || obj === null;
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isSymbol = (fn: any): fn is symbol => typeof fn === 'symbol';

export interface IHttpExceptionBody {
  error?: string;
  message: string;
  ext: object;
}

export function createKErrorBody(
  error?: object | string,
  message?: string,
  detail?: object,
): IHttpExceptionBody {

  const err = isString(error) ? error: JSON.stringify(error, null, 2);

  return {
    error: err,
    message: message || err,
    ext: detail || {},
  };
};

// NOTE : Custom Error 만들기



export class KError extends HttpException {
  extraInfo: object;
  constructor(
    error?: string | object | any,
    statusCode: number = 400,
    message: string = 'Unauthorized',
    extraInfo: object = {}
  ) {
    super(
      createKErrorBody(error, message, extraInfo),
      statusCode,
    );
    this.extraInfo = extraInfo || {};
    console.log(this);
  }

  getErrorString() {
    return this.getResponse();
  }
  getExtraInfo() {
    return this.extraInfo;
  }
}

export { HttpStatus };


// NOTE : Using Custom Error
// import KError;
// throw new KError('TEST ERROR', {}, 400);
