import { Package, PackageFactory } from "../model/package";
import { Json2Model } from "../model/json2model";
import { checkProperty, checkType } from "../model/exceptions";
import { injectable, inject } from "inversify";
import { TYPES } from "./types";

@injectable()
export class NpmSearch2Package implements Json2Model<Package[]> {

  constructor( @inject(TYPES.PackageFactory)private packageFactory: PackageFactory = new PackageFactory()) {}

  toModel(jsonString: string): Package[] {
    const jsonPackages = JSON.parse(jsonString);
    const modelPackages = new Array<Package>();
    //the type has to be array
    checkType( Object.getPrototypeOf(jsonPackages).constructor.name, Array.name);
    jsonPackages.forEach(jsonPackage => {
      //check all the properties are available
      checkProperty('name',jsonPackage);
      checkProperty('description',jsonPackage);
      checkProperty('maintainers',jsonPackage);
      checkProperty('version',jsonPackage);
      modelPackages.push(
        this.packageFactory.createPackage(
          jsonPackage.name,
          jsonPackage.description,
          jsonPackage.maintainers[0].username,
          jsonPackage.version
        )
      );
    });
    return modelPackages;
  }
  toJson(model: Package[]): string {
    return JSON.stringify(model);
  }
}
