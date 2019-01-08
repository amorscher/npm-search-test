import * as cp from "child_process";

const DEFAULT_SPAWN_OPTIONS: cp.SpawnOptions = {
  shell: true
};

export class NpmExecution {
  constructor(
    private npmCommand: string,
    private args: string[],
    private registryURI: string,
    private spawn:(command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions) =>cp.ChildProcess = cp.spawn
  ) {}

  public execute(): Promise<string> {
    return new Promise((resolve, reject) => {
      const childprocess = this.spawn(
        "npm", [this.npmCommand].concat(this.args).concat(["--registry=" + this.registryURI]),DEFAULT_SPAWN_OPTIONS);
      var result = "";
      //get all the results from stdout
      childprocess.stdout.on("data", data => {
        result += data.toString();
      });

      childprocess.on("exit", (code: number, signal: string) => {
        resolve(result);
      });

      childprocess.on("error", (error: Error) => {
        reject(error);
      });
    });
  }
}
