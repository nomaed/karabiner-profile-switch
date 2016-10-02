import * as chalk from "chalk";
import { IKarabinerConfigFile } from "./types";
import { readChar, readLine } from "./lib/input";
import { exists, readFile, writeFile, exec } from "./lib/promisify";

// set default config file location
const config = {
  defultConfigFile: "~/.karabiner.d/configuration/karabiner.json",
  service: "org.pqrs.karabiner.karabiner_console_user_server",
};

// (TODO) read config file location from args or use default
let configFile = config.defultConfigFile;

// keep list of profiles once data has been loaded
let profilesData: IKarabinerConfigFile;

// if config file is located at home directory using shorthand syntax, expand to use full $HOME dir name
if (configFile.charAt(0) === "~") {
  const homeDir: string | undefined = process.env.HOME;
  if (!homeDir) {
    console.error("Unable to read home directory, aborting");
    process.exit(10);
  }
  configFile = homeDir + configFile.substr(1);
}

// load configuration
exists(configFile)
  .then(loadConfig)
  .then(parseConfig)
  .then(validateConfig)
  .then(cacheConfig)
  .then(selectNewProfile)
  .then(saveConfig)
  .then(restartService)
  .then(() => {
    console.log("Done.");
  })
  .catch(err => {
    console.error(chalk.red(err));
    process.exit(1);
  });

function loadConfig(): Promise<any> {
  return readFile(configFile);
}


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

function cacheConfig(cfg: IKarabinerConfigFile) {
  profilesData = cfg;
}

function selectNewProfile(): Promise<number> {
  const code1 = "1".charCodeAt(0);
  return new Promise((resolve, reject) => {
    printCurrentProfiles();

    const profNum = profilesData.profiles.length;
    process.stdout.write(`Please select profile number: `);

    readLine("utf8")
      .then(input => {
        const numVal = Number(input);
        if (isNaN(numVal) || numVal < 1 || numVal > profNum) {
          reject("Invalid profile number");
          return;
        }
        resolve(numVal);
      })
      .catch(() => {
        reject("Can't read input");
      });
  });
}

function printCurrentProfiles() {
  console.log(chalk.white.underline("Karabiner-Elements profiles:"));
  profilesData.profiles.forEach((profile, idx) => {
    const parts = [
      profile.selected ? chalk.green(" ->") : "   ",
      chalk.blue((idx + 1) + ")"),
      chalk.yellow(profile.name),
    ];
    console.log(parts.join(" "));
  });
}

function saveConfig(selIdx: number): Promise<void> {
  console.log("Setting active profile:", chalk.bold.white(profilesData.profiles[selIdx - 1].name));
  profilesData.profiles.forEach((profile, idx) => profile.selected = idx + 1 === selIdx);

  console.log("Saving data...");
  return writeFile(configFile, JSON.stringify(profilesData, undefined, 2));
}

function restartService(): Promise<void> {
  console.log("Restarting service...");
  return exec(`launchctl stop ${config.service}`)
    .then(() => exec(`launchctl start ${config.service}`));
}