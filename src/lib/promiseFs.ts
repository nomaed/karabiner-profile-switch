import * as fs from "fs";

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