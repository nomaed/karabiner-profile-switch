#!/usr/bin/env node
import { exists, readFile } from "./lib/promiseFs";
import { parseConfig, validateConfig } from "./lib/data";
import { IKarabinerConfigFile } from "./types";

// set default config file location
const defaultConfig = "~/.karabiner.d/configuration/karabiner.json";

// (TODO) read config file location from args or use default
let configFile = defaultConfig;

// if config file is located at home directory using shorthand syntax, expand to use full $HOME dir name
if (configFile.charAt(0) === "~") {
  const homeDir: string | undefined = process.env.HOME;
  if (!homeDir) {
    console.error("Unable to read home directory, aborting");
    process.exit(10);
  }
  configFile = homeDir + configFile.substr(1);
}

let profilesData: IKarabinerConfigFile;

// load configuration
exists(configFile)
  .then(() => readFile(configFile))
  .then(parseConfig)
  .then(validateConfig)
  .then(cfg => {
    profilesData = cfg;
    console.log(cfg);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

