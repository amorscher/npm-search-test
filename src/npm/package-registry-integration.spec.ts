import {NpmPackageRegistry} from "./npm-package-registry";
import { PackageImpl } from "../model/package";
import { PackageRegistry } from "../package-registry";

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

    it('test that packages can be found in the registry',testAsync(async () => {
        //GIVEN
        const theRegistry = new NpmPackageRegistry();
        //WHEN
        const foundPackages= await theRegistry.searchPackagesWithKeywords(['express']);
        //THEN
        expect(foundPackages).toBeDefined();
        expect(foundPackages.length).toBeGreaterThan(0);
        //first package is the express package
        expect(foundPackages[0].name).toBe('express');
  
    }));

    it('test that packages can be found in the registry for multiple keywords',testAsync(async () => {
        //GIVEN
        const theRegistry = new NpmPackageRegistry();
        //WHEN
        const foundPackages= await theRegistry.searchPackagesWithKeywords(['express','test']);
        //THEN
        expect(foundPackages).toBeDefined();
        expect(foundPackages.length).toBeGreaterThan(0);
        //first package is the express package
        expect(foundPackages[0].name).toBe('express');
  
    }));

    it('test that not finding any result does not result in an error',testAsync(async () => {
        //GIVEN
        const theRegistry = new NpmPackageRegistry();
        //WHEN
        const foundPackages= await theRegistry.searchPackagesWithKeywords(['notexistingkeyword???????']);
        //THEN
        expect(foundPackages).toBeDefined();
        expect(foundPackages.length).toBe(0);
    
  
    }));

    it('test package json can be retrieved using npm view',testAsync(async () => {
        //GIVEN
        const theRegistry:PackageRegistry = new NpmPackageRegistry();
        const packageToViewDetails = new PackageImpl("express","desscription","versions","");
        //WHEN
        const details:any= await theRegistry.viewDetailsOf(packageToViewDetails);
        //THEN
        expect(details).toBeDefined();
        expect(details.dependencies).toBeDefined();
        expect(details.license).toBeDefined();
        expect(details.version).toBeDefined();
    
  
    }));

    it('test specific tags can be retrieved from a package',testAsync(async () => {
        //GIVEN
        const theRegistry = new NpmPackageRegistry();
        const packageToViewDetails = new PackageImpl("express","desscription","versions","");
        //WHEN
        const details:any= await theRegistry.viewDetailsOf<any>(packageToViewDetails,['dependencies','version']);
        //THEN
        expect(details).toBeDefined();
        expect(details.dependencies.methods).toBeDefined();
        expect(details.version).toBeDefined();
        expect(details.license).toBeUndefined();
    
  
    }));

    it('test that specific tag with correct type can be retrieved ',testAsync(async () => {
        //GIVEN
        const theRegistry = new NpmPackageRegistry();
        const packageToViewDetails = new PackageImpl("express","desscription","versions","");
        //WHEN
        const details:any= await theRegistry.viewDetailsOf<any>(packageToViewDetails,['dependencies','version']);
        //THEN
        expect(details).toBeUndefined();    
  
    }));

});