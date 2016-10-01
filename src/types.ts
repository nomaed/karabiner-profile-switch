export interface IKarabinerConfigFile {
  profiles: Array<IKarabinerConfig>;
}

export interface IKarabinerConfig {
  name: string;
  selected: boolean;
  simple_modifications: {[key: string]: string};
}

