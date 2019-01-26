import { Container } from "inversify";
import "reflect-metadata";
import { modelContainer } from "./model/inversify.config";
import { npmPackageRegistryContainer } from "./npm/inversify.config";

const packageRegistryContainer = Container.merge(modelContainer,npmPackageRegistryContainer);

export { packageRegistryContainer };