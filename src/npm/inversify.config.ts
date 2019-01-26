import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "../types";
import { TYPES as NPM_TYPES } from "./types";
import { NpmExecutionFactory } from "./npm-execution-factory";
import { NpmSearch2Package } from "./npm-search-2-package";
import { NpmPackageRegistry } from "./npm-package-registry";
import { PackageRegistry } from "../package-registry";
import { PackageRegistryFactory } from "../package-registry-factory";
import { NpmPackageRegistryFactory } from "./npm-package-registry-factory";


const npmPackageRegistryContainer = new Container();
npmPackageRegistryContainer.bind<NpmExecutionFactory>(NPM_TYPES.NpmExecutionFactory).to(NpmExecutionFactory);
npmPackageRegistryContainer.bind<NpmSearch2Package>(NPM_TYPES.NpmSearch2Package).to(NpmSearch2Package);
npmPackageRegistryContainer.bind<PackageRegistry>(TYPES.PackageRegistry).to(NpmPackageRegistry);
npmPackageRegistryContainer.bind<PackageRegistryFactory>(TYPES.PackageRegistryFactory).to(NpmPackageRegistryFactory);

export { npmPackageRegistryContainer };