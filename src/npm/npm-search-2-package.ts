import { Package, PackageFactory } from "../model/package";
import { Json2Model } from "../model/json2model";

export class NpmSearch2Package implements Json2Model<Package[]> {
  constructor(private packageFactory: PackageFactory = new PackageFactory()) {}

  toModel(jsonString: string): Package[] {
    const jsonPackages = JSON.parse(jsonString);
    const modelPackages = new Array<Package>();
    jsonPackages.forEach(jsonPackage => {
      modelPackages.push(
        this.packageFactory.createPackage(
          jsonPackage.name,
          jsonPackage.description,
          jsonPackage.maintainers[0].name,
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
