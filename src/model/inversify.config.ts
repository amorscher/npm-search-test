import { Container } from "inversify";
import "reflect-metadata";
import { TYPES as MODEL_TYPES } from "./types";


import { PackageFactory } from "./package";


const modelContainer = new Container();
modelContainer.bind<PackageFactory>(MODEL_TYPES.PackageFactory).to(PackageFactory);


export { modelContainer };