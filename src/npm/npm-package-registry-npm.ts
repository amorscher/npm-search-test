import { Package } from "../model/package";
import { Json2Model } from "../model/json2model";

import * as cp from "child_process";
import { NpmSearch2Package } from "./npm-search-2-package";
import npm = require("npm");

const DEFAULT_INSTALL_OPTIONS: cp.SpawnOptions = {
  shell: true
};
export class NpmPackageRegistryNpm {
  constructor(
    private registryURI: string = "https://registry.npmjs.com/",
    private jsonToModel: Json2Model<Package[]> = new NpmSearch2Package()
  ) {}

  public async searchPackagesWithKeywords(
    tags: string[],
    searchLimit: number = 1000
  ): Promise<Package[]> {
    //Promise for the Packages
    return new Promise<Package[]>((resolve, reject) => {
      npm.load({json:true,registry:this.registryURI},(err, result) => {
        npm.commands.search(
          [
            "express"
           
           
          ],
          (error, result,result1,result2,result3) => {
            if (error) {
              reject(error);
            }
            const resultString = result.toString();
            const packages =   console.log(Object.keys(result));
            const foundPackages = this.jsonToModel.toModel(result.toString() as string);
            //convert json to packages
            resolve(foundPackages);
          }
        );
      });
    });
  }
}
