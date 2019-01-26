import { NpmExecution } from "./npm-execution";
import { Package } from "../model/package";
import { injectable } from "inversify";

@injectable()
export class NpmExecutionFactory{

    public createNpmExecution( npmCommand: string,
         args: string[],
         registryURI: string,):NpmExecution{

            return new NpmExecution(npmCommand,args,registryURI);
    }

    public createNpmSearchExecution(keywords: string[],searchLimit:number,registryURI:string){
        //check the parameters

        return this.createNpmExecution( "search",
        ["keywords:" + keywords.join(","), "--json", "--searchlimit=" + searchLimit],
        registryURI);
    }

    public createNpmViewExecution(thePackage: Package, keys: string[] = [],registryURI:string){
        return this.createNpmExecution( "view",
        [thePackage.name, keys.join(" "), "--json"],
        registryURI);
    }


}