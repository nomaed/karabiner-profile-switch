import { IKarabinerConfigFile } from "../types";

export function parseConfig(data: Buffer): Promise<IKarabinerConfigFile> {
  return new Promise((resolve, reject) => {
    // conver to JSON
    const json = JSON.parse(data.toString());
    resolve(json);
  });
}

export function validateConfig(cfg: IKarabinerConfigFile): Promise<IKarabinerConfigFile> {
  return new Promise((resolve, reject) => {
    // check for data type
    if (!cfg || typeof cfg !== "object") {
      reject("Invalid data type detected");
      return;
    }
    // check for profiles
    if (!cfg.profiles || !Array.isArray(cfg.profiles)) {
      reject("No profiles were found");
      return;
    }
    // make sure all profiles have valid names
    if (!cfg.profiles.every(profile => Boolean(profile.name))) {
      reject("Invalid (unnamed) profiles found");
      return;
    }
    resolve(cfg);
  });
}