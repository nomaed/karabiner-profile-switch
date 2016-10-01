import * as chalk from "chalk";
import { IKarabinerConfigFile } from "./types";
import { exists, readFile, writeFile } from "./lib/promiseFs";
import { parseConfig, validateConfig } from "./lib/data";
import { readChar, readLine } from "./lib/input";

// set default config file location
const defaultConfig = "~/.karabiner.d/configuration/karabiner.json";

// (TODO) read config file location from args or use default
let configFile = defaultConfig;

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
