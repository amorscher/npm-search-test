import { PackageRegistryFactory } from "../package-registry-factory";
import { NpmPackageRegistry } from "./npm-package-registry";
import { injectable, inject } from "inversify";
import { TYPES } from "./types";
import { NpmSearch2Package } from "./npm-search-2-package";
import { NpmExecutionFactory } from "./npm-execution-factory";

@injectable()
export class NpmPackageRegistryFactory implements PackageRegistryFactory{
    
    constructor( @inject(TYPES.NpmSearch2Package)private jsonToModel: NpmSearch2Package = new NpmSearch2Package(),
    @inject(TYPES.NpmExecutionFactory)private npmExecutionFactory: NpmExecutionFactory = new NpmExecutionFactory()){
        
    }

    createPackageRegistry(registryUri: string) {
        return new NpmPackageRegistry(registryUri,this.jsonToModel,this.npmExecutionFactory);
    }

}