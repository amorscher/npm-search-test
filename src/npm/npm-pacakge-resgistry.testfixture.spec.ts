import { NpmExecutionFactory } from "./npm-execution-factory";
import { NpmSearch2Package } from "./npm-search-2-package";
import { NpmPackageRegistry } from "./npm-package-registry";
import { NpmExecution } from "./npm-execution";

export class NpmPackageRegistryTestFixture {
    mockedNpmExecutionFactory: NpmExecutionFactory;

    constructor(protected npmRegistryUrl: string) {
        this.mockedNpmExecutionFactory = new NpmExecutionFactory();
    }

    public npmRegistryWithMockedCalls() {
        return new NpmPackageRegistry(this.npmRegistryUrl, new NpmSearch2Package(), this.mockedNpmExecutionFactory);
    }

    public mockNpmExecutionFactory(mockedNpmCall: keyof NpmExecutionFactory, mockedResult: any): NpmPackageRegistryTestFixture {
        const mockedNpmSearchExecution = new NpmExecution("whatever", [], "registry");
        spyOn(mockedNpmSearchExecution, "execute").and.returnValue(Promise.resolve(JSON.stringify(mockedResult)));
        spyOn(this.mockedNpmExecutionFactory, mockedNpmCall).and.returnValue(mockedNpmSearchExecution);
        return this;
    }

    static instance(npmRegistryUrl: string = "https://registry.npmjs.com/"): NpmPackageRegistryTestFixture {
        return new NpmPackageRegistryTestFixture(npmRegistryUrl);
    }
}

export async function checkForErrorInAsyncFunction(functionToTest: () => Promise<any>, exceptionType: any = Error) {
    let errorOccurred = false;
    //this error is used to capture the stacktrace as it gets lost in nested async await calls
    const stacktraceError = new Error("stacktraceerror");
    try {
        await functionToTest();
    } catch (err) {
        expect(err).toBeDefined();
        expect(err instanceof exceptionType).toBe(
            true,
            //attach the stacktrace error to have a meaningful stacktrace in order to be able to find the calling function
            `error is not an instance of ${exceptionType.name} it is an instance of ${err.constructor.name}  ${stacktraceError.stack}`
        );

        errorOccurred = true;
    }
    expect(errorOccurred).toBeTruthy(`An Error has to occurr ${stacktraceError.stack}`);
    return Promise.resolve(true);
}

export function checkForErrorInFunction(functionToTest: () => any, exceptionType: any): void {
    let errorOccurred = false;
    try {
        functionToTest();
    } catch (err) {
        expect(err).toBeDefined();
        expect(err instanceof exceptionType).toBe(
            true,
            "error is not an instance of " + exceptionType.name + " it is an instance of " + err.constructor.name
        );
        errorOccurred = true;
    }
    expect(errorOccurred).toBeTruthy("An Error has to occurr");
}
