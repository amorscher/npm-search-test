import { packageRegistryFactory } from ".";

describe('Test Dependency injection', () => {
    it('Package registry can be created', () => {
        //GIVEN
        const registryUri = "theregistry";
        //WHEN
        const registry = packageRegistryFactory.createPackageRegistry(registryUri);
        //THEN
        expect(registry).toBeDefined();
    });
});