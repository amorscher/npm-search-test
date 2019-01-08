import { Package } from "../model/package";
import * as npm from "npm";
import * as cp from "child_process";
import { NpmSearch2Package } from "./npm-search-2-package";
import { PackageRegistry } from "../package-registry";
import { Json2Model } from "../model/json2model";
import { NpmExecution } from "./npm-execution";
import { reject } from "q";

const DEFAULT_INSTALL_OPTIONS: cp.SpawnOptions = {
  shell: true
};
export class NpmPackageRegistry implements PackageRegistry {
  constructor(
    private registryURI: string = "https://registry.npmjs.com/",
    private jsonToModel: Json2Model<Package[]> = new NpmSearch2Package()
  ) {}

  public async searchPackagesWithKeywords(
    tags: string[],
    searchLimit: number = 1000
  ): Promise<Package[]> {
    //Do the conversion to the Package afterwards in another Promise
    return new NpmExecution(
      "search",
      ["keywords:" + tags.join(","), "--json", "--searchLimit=" + searchLimit],
      this.registryURI
    )
      .execute()
      .then(result => this.jsonToModel.toModel(result));
  }

  viewDetailsOf<T>(thePackage: Package, keys: string[] = []): Promise<T> {
    //Npm View execution
    return new NpmExecution(
      "view",
      [thePackage.name, keys.join(" "), "--json"],
      this.registryURI
    )
      .execute()
      .then(result => JSON.parse(result) as T);
  }
}
