import { HttpStatus } from "@nestjs/common";

export { HttpStatus };

export class RetType<T> {
  cd: number;
  data?: T;
  err?: string;
  msg?: string;
  ext?: object;

  constructor(
    data?: T,
  ) {
    this.cd = HttpStatus.OK;
    if (data) {
      this.data = data;
    }
  }

  public setHttpStatus(cd: number): RetType<T> {
    this.cd = cd;
    return this;
  }
  public setCode(cd: number): RetType<T> {
    this.cd = cd;
    return this;
  }

  public setData(data: T | undefined): RetType<T> {
    this.data = data;
    return this;
  }
  public setMsg(msg: string): RetType<T> {
    this.msg = msg;
    return this;
  }

  public setExt(ext: object): RetType<T> {
    this.ext = ext;
    return this;
  }

  public setErr(err: string): RetType<T> {
    this.err = err;
    return this;
  }

  public static new<T>(data?: T): RetType<T> {
    return new RetType<T>(data);
  }

  getHttpStatusCode(): number {
    return this.cd;
  }

  getBody(): object {
    return {
      ...this.data,
      msg: this.msg,
      ext: this.ext,
    };
  }

}

