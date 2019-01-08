import { Package } from "./model/package";

export interface PackageRegistry{
    
    searchPackagesWithKeywords(tags:string[],searchLimit:number):Promise<Package[]>;
    viewDetailsOf<T>(thePackage:Package,keys?:string[]):Promise<T>;

}