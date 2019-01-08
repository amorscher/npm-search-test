import {NpmPackageRegistry} from "./npm-package-registry";
import { NpmPackageRegistryNpm } from "./npm-package-registry-npm";

// The helper function
function testAsync(runAsync) {
    return done => {
      runAsync().then(done, e => { fail(e); done(); });
    };
  }

/**
 * Integration tests for the package registry
 */
describe('NPM Package registry integration tests', () => {

    
    beforeEach(() => {

     

    });

    // it('test that packages can be found in the registry',testAsync(async () => {
    //     //GIVEN
    //     const theRegistry = new NpmPackageRegistryNpm();
    //     //WHEN
    //     const foundPackages= await theRegistry.searchPackagesWithKeywords(['express']);
    //     //THEN
    //     expect(foundPackages).toBeDefined();
    //     expect(foundPackages.length).toBeGreaterThan(0);
    //     //first package is the express package
    //     expect(foundPackages[0].name).toBe('express');
  
    // }));

    // it('test that packages can be found in the registry for multiple keywords',testAsync(async () => {
    //     //GIVEN
    //     const theRegistry = new NpmPackageRegistryNpm();
    //     //WHEN
    //     const foundPackages= await theRegistry.searchPackagesWithKeywords(['express','test']);
    //     //THEN
    //     expect(foundPackages).toBeDefined();
    //     expect(foundPackages.length).toBeGreaterThan(0);
    //     //first package is the express package
    //     expect(foundPackages[0].name).toBe('express');
  
    // }));

    // it('test that not finding any result does not result in an error',testAsync(async () => {
    //     //GIVEN
    //     const theRegistry = new NpmPackageRegistryNpm();
    //     //WHEN
    //     const foundPackages= await theRegistry.searchPackagesWithKeywords(['notexistingkeyword???????']);
    //     //THEN
    //     expect(foundPackages).toBeDefined();
    //     expect(foundPackages.length).toBe(0);
    
  
    // }));

});