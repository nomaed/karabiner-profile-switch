import { ReadStream } from "tty";

export function readChar(): Promise<Buffer>;
export function readChar(encoding: string): Promise<string>;
export function readChar(encoding?: string): Promise<Buffer|string> {
  return getData(true, encoding);
}

export function readLine(): Promise<Buffer>;
export function readLine(encoding: string): Promise<string>;
export function readLine(encoding?: string): Promise<Buffer|string> {
  return getData(false, encoding);
}

function getData(raw: boolean, encoding?: string): Promise<Buffer|string> {
  return new Promise((resolve, reject) => {
    const stdin = <ReadStream>process.stdin;
    const wasRaw = stdin.isRaw;
    if (encoding) {
      stdin.setEncoding(encoding);
    }
    stdin.setRawMode(raw);
    stdin.resume();
    stdin.once("data", (data: Buffer|string) => {
      stdin.pause();
      stdin.setRawMode(wasRaw);
      resolve(data);
    });
  });
}