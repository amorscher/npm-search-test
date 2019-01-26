
import {packageRegistryContainer} from './inversify.config'
import { PackageRegistry } from './package-registry';
import { TYPES } from './types';
import { PackageRegistryFactory } from './package-registry-factory';


export const packageRegistryFactory = packageRegistryContainer.get<PackageRegistryFactory>(TYPES.PackageRegistryFactory);