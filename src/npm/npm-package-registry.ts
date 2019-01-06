import { Package } from "../model/package";
import * as npm from "npm";
import * as cp from "child_process";
import { NpmSearch2Package } from "./npm-search-2-package";
import { PackageRegistry } from "../package-registry";
import { Json2Model } from "../model/json2model";

const DEFAULT_INSTALL_OPTIONS:cp.SpawnOptions = {
   
    shell: true
  };
export class NpmPackageRegistry implements PackageRegistry{
   

    constructor(private registryURI:string = "https://registry.npmjs.com/",private jsonToModel:Json2Model<Package[]> = new NpmSearch2Package()){
    }


    public async searchPackagesWithKeywords(tags:string[],searchLimit:number = 1000):Promise<Package[]>{
        //Promise for the Packages
        return new Promise<Package[]>((resolve,reject)=>{
            //spawn an npm search process with inheritance for all ios
            const childprocess = cp.spawn('npm',['search','keywords:'+tags.join(','),'--json','--searchLimit='+searchLimit,'--registry='+this.registryURI], DEFAULT_INSTALL_OPTIONS,);
            var searchResults = "";
            //get all the results from stdout
            childprocess.stdout.on('data',(data)=>{
                searchResults += data.toString();
            });

            childprocess.on("exit",(code: number, signal: string)=>{
                const foundPackages = this.jsonToModel.toModel(searchResults);
                //convert json to packages
                resolve(foundPackages);
            })

            childprocess.on("error",(error: Error)=>{
                reject(error);
            })
           
        });
    }

}