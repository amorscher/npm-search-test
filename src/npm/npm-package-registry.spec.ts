import { NpmPackageRegistry } from "./npm-package-registry";
import { PackageImpl, PackageFactory } from "../model/package";
import { PackageRegistry } from "../package-registry";
import { NpmExecutionFactory } from "./npm-execution-factory";
import { NpmExecution } from "./npm-execution";
import { NpmSearch2Package } from "./npm-search-2-package";
import { NpmPackageRegistryTestFixture, checkForErrorInAsyncFunction } from "./npm-pacakge-resgistry.testfixture.spec";
import { JsonToModelException, IllegalArgumentException } from "../model/exceptions";

interface DepType {
    accepts: string;
    "array-flatten": string;
}

// The helper function
function testAsync(runAsync) {
    return done => {
        runAsync().then(done, e => {
            fail(e);
            done();
        });
    };
}



/**
 * Integration tests for the package registry
 */
describe("npm-package-registy.spec.ts unit tests: ", () => {
    beforeEach(() => {});

    it(
        "test that specific tag with correct type can be retrieved ",
        testAsync(async () => {
            //GIVEN
            const result = {
                accepts: "~1.3.5",
                "array-flatten": "1.1.1"
            };
            const itemUnderTest = NpmPackageRegistryTestFixture.instance()
                .mockNpmExecutionFactory("createNpmExecution", result)
                .npmRegistryWithMockedCalls();

            const packageToViewDetails = new PackageFactory().fromName("express");

            //WHEN
            const details = await itemUnderTest.viewDetailsOf<DepType>(packageToViewDetails, ["dependencies", "version"]);
            //THEN
            expect(details["array-flatten"]).toBeDefined();
            expect(details["array-flatten"]).toBe("1.1.1");
            expect(details.accepts).toBeDefined();
            expect(details.accepts).toBe("~1.3.5");
        })
    );

    it(
        "test that view details result is correctly coverted to json ",
        testAsync(async () => {
            //GIVEN
            const result = {
                accepts: "~1.3.5",
                "array-flatten": "1.1.1"
            };
            const itemUnderTest = NpmPackageRegistryTestFixture.instance()
                .mockNpmExecutionFactory("createNpmExecution", result)
                .npmRegistryWithMockedCalls();

            const packageToViewDetails = new PackageFactory().fromName("express");

            //WHEN
            const details = await itemUnderTest.viewDetailsOf<any>(packageToViewDetails, ["dependencies", "version"]);
            //THEN
            expect(details["array-flatten"]).toBeDefined();
            expect(details["array-flatten"]).toBe("1.1.1");
            expect(details.accepts).toBeDefined();
            expect(details.accepts).toBe("~1.3.5");
        })
    );

    it(
        "test that search result is correctly coverted to package details ",
        testAsync(async () => {
            //GIVEN
            const result = require("./testnpmsearchresult.json");
            const itemUnderTest = NpmPackageRegistryTestFixture.instance()
                .mockNpmExecutionFactory("createNpmSearchExecution", result)
                .npmRegistryWithMockedCalls();

            //WHEN
            const packages = await itemUnderTest.searchPackagesWithKeywords(["watheverkeyword"]);
            //THEN
            expect(packages.length).toBe(2);
            const firstPackage = packages[0];
            expect(firstPackage.name).toBe("express");
            expect(firstPackage.version).toBe("4.16.4");
            expect(firstPackage.description).toBe("Fast, unopinionated, minimalist web framework");
            expect(firstPackage.author).toBe("dougwilson");
        })
    );
    it(
        "test that if search result has not correct json format exception is thrown",
        testAsync(async () => {
            //GIVEN
            const result = [{ name: "express" }];
            const itemUnderTest = NpmPackageRegistryTestFixture.instance()
                .mockNpmExecutionFactory("createNpmSearchExecution", result)
                .npmRegistryWithMockedCalls();

            //WHEN THEN
            await checkForErrorInAsyncFunction(
                () => itemUnderTest.searchPackagesWithKeywords(["watheverkeyword"]),
                JsonToModelException
            );
        })
    );
    it(
        "test that if search is called with undefined keywords an error occurrs",
        testAsync(async () => {
            //GIVEN
            const result = [{ name: "express" }];
            const itemUnderTest = NpmPackageRegistryTestFixture.instance()
                .mockNpmExecutionFactory("createNpmSearchExecution", result)
                .npmRegistryWithMockedCalls();

            //WHEN THEN
            await checkForErrorInAsyncFunction(() => itemUnderTest.searchPackagesWithKeywords(undefined), IllegalArgumentException);
        })
    );

    it(
        "test that if search is called with empty keywords an error occurrs",
        testAsync(async () => {
            //GIVEN
            const result = [{ name: "express" }];
            const itemUnderTest = NpmPackageRegistryTestFixture.instance()
                .mockNpmExecutionFactory("createNpmSearchExecution", result)
                .npmRegistryWithMockedCalls();
            //WHEN THEN
            await checkForErrorInAsyncFunction(() => itemUnderTest.searchPackagesWithKeywords([]), IllegalArgumentException);
        })
    );

    it(
        "test that if detailsOf is called with undefined package an error occurrs",
        testAsync(async () => {
            //GIVEN
            
            const itemUnderTest = NpmPackageRegistryTestFixture.instance().npmRegistryWithMockedCalls();
            //WHEN THEN
            await checkForErrorInAsyncFunction(() => itemUnderTest.viewDetailsOf(undefined), IllegalArgumentException);
        })
    );

    it(
        "test that if detailsOf is called with undefined package name an error occurrs",
        testAsync(async () => {
            //GIVEN
            
            const itemUnderTest = NpmPackageRegistryTestFixture.instance().npmRegistryWithMockedCalls();
            //WHEN THEN
            await checkForErrorInAsyncFunction(() => itemUnderTest.viewDetailsOf(new PackageFactory().fromName(undefined)), IllegalArgumentException);
        })
    );

});
