import * as fs from "fs";
import * as child_process from "child_process";

export interface IExecPromiseResult<T> {
  stdout: T;
  stderr: T;
}

export function exists(file: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.exists(file, found => {
      if (found) resolve(true);
      else reject(`Configuration file ${file} does not exist`);
    });
  });
}

export function readFile(file: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err.message);
      }
    });
  });
}

export function writeFile(file: string, data: Buffer | string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (!err) {
        resolve();
      } else {
        reject(err.message);
      }
    });
  });
}

export function exec(command: string): Promise<IExecPromiseResult<string>>;
export function exec(command: string, options: child_process.ExecOptions): Promise<IExecPromiseResult<string>>;
export function exec(command: string, options: child_process.ExecOptionsWithStringEncoding): Promise<IExecPromiseResult<string>>;
export function exec(command: string, options: child_process.ExecOptionsWithBufferEncoding): Promise<IExecPromiseResult<Buffer>>;
export function exec(command: string, options?: any): Promise<IExecPromiseResult<string | Buffer>> {
  return new Promise<IExecPromiseResult<string | Buffer>>((resolve, reject) => {
    child_process.exec(command, options, (err: NodeJS.ErrnoException, stdout: string | Buffer, stderr: string | Buffer) => {
      if (err && err.code !== "0") {
        reject(err.message);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}