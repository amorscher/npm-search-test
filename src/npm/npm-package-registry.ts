import { Package } from "../model/package";
import * as npm from "npm";
import * as cp from "child_process";
import { NpmSearch2Package } from "./npm-search-2-package";
import { PackageRegistry } from "../package-registry";
import { Json2Model } from "../model/json2model";
import { NpmExecution } from "./npm-execution";
import { reject } from "q";
import { NpmExecutionFactory } from "./npm-execution-factory";
import { throws } from "assert";
import { checkArgument } from "../model/exceptions";
import { injectable, inject } from "inversify";
import { TYPES } from "./types";

const DEFAULT_INSTALL_OPTIONS: cp.SpawnOptions = {
    shell: true
};
@injectable()
export class NpmPackageRegistry implements PackageRegistry {
    constructor(
        private registryURI: string = "https://registry.npmjs.com/",
        @inject(TYPES.NpmSearch2Package)private jsonToModel: NpmSearch2Package = new NpmSearch2Package(),
        @inject(TYPES.NpmExecutionFactory)private npmExecutionFactory: NpmExecutionFactory = new NpmExecutionFactory()
    ) {}

    public searchPackagesWithKeywords(keywords: string[], searchLimit: number = 1000): Promise<Package[]> {

        checkArgument(keywords !== undefined, 'keywords MUST BE defined');
        checkArgument(keywords.length > 0, 'keywords MUST NOT BE empty');
        //Do the conversion to the Package afterwards in another Promise
        return this.npmExecutionFactory
            .createNpmSearchExecution(keywords,searchLimit,this.registryURI)
            .execute()
            .then(result => this.jsonToModel.toModel(result));
    }

    public  viewDetailsOf<T>(thePackage: Package, keys: string[] = []): Promise<T> {
      //package has to be defined
      checkArgument(thePackage !== undefined, "thePackage to search for MUST BE defined");
      //package has to have a name  
      checkArgument(thePackage.name !== undefined, "thePackage name MUST BE defined");
      //Npm View execution
        return this.npmExecutionFactory
            .createNpmViewExecution(thePackage, keys, this.registryURI)
            .execute()
            .then(result => JSON.parse(result) as T);
    }
}
