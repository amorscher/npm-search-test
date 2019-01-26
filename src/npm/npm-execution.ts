import * as cp from "child_process";
import { checkArgument } from "../model/exceptions";

const DEFAULT_SPAWN_OPTIONS: cp.SpawnOptions = {
  shell: true
};

export class NpmExecution {
  constructor(
    private npmCommand: string,
    private args: string[],
    private registryURI: string,
    private spawn:(command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions) =>cp.ChildProcess = cp.spawn
  ) {
    checkArgument(npmCommand !== undefined, "A command has to be provided");

  }

  public execute(): Promise<string> {
   
    return new Promise((resolve, reject) => {
      
      const childprocess = this.spawn(
        "npm", [this.npmCommand,...this.args,"--registry=" + this.registryURI],DEFAULT_SPAWN_OPTIONS);
      
      var result = "";
      var error = "";
      //get all the results from stdout
      childprocess.stdout.on("data", data => {
        result += data.toString();
      });
      // get all the error messages from the stderr
      childprocess.stderr.on("data", data => {
        error += data.toString();
      });
      //on exit resolve the promise with the whole output
      childprocess.on("exit", (code: number, signal: string) => {
        //if error occurred reject the promise
        if(code > 0){
          //with error message or result
          reject(new Error(error !== ''?error + result: result));
        }else{
          resolve(result);
        }
      });
      // if error occurs reject
      childprocess.on("error", (error: Error) => {
        reject(error);
      });
      childprocess.emit("created", true);
     
    });
  }
}
