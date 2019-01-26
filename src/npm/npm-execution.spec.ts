import { NpmExecution } from "./npm-execution";
import { IllegalArgumentException } from "../model/exceptions";
import { checkForErrorInFunction, checkForErrorInAsyncFunction } from "./npm-pacakge-resgistry.testfixture.spec";
import { CpuInfo } from "os";
import { EventEmitter } from "events";
import * as cp from "child_process";
import { Readable } from "stream";

export class MockedSpawn {

    public createdChildProcess: cp.ChildProcess;
    command: string;
    args: ReadonlyArray<string>;
    options: cp.SpawnOptions;
    created: boolean;

    constructor() {
        this.createdChildProcess = new EventEmitter() as cp.ChildProcess;
        this.createdChildProcess.on("created", data => {
            this.created = true;
        });
    }

    public mockedSpawnFunction(command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions): cp.ChildProcess {
        this.command = command;
        this.args = args;
        this.options = options;

        this.createdChildProcess.stdout = new EventEmitter() as Readable;
        this.createdChildProcess.stderr = new EventEmitter() as Readable;
        return this.createdChildProcess;
    }

    public exit(exitCode:number = 0): Promise<boolean> {
        return this.wrapInPromise(() => this.createdChildProcess.emit("exit", [exitCode]));
    }
    protected wrapInPromise(codeToWrap: () => boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, rejected) => {
            if (this.created) {
                codeToWrap();
                resolve(true);
            } else {
                this.createdChildProcess.on("created", data => {
                    codeToWrap();
                    resolve(data);
                });
            }
        });
    }

    public sendToStdErr(error: string): Promise<any> {
        return  this.wrapInPromise(() =>this.createdChildProcess.stderr.emit("data", [error]));
    }

    public sendToStdOut(stdout: string): Promise<any> {
        return  this.wrapInPromise(() =>this.createdChildProcess.stdout.emit("data", [stdout]));
    }
}

describe("npm-execution unit tests", () => {
    beforeEach(() => {});
    it("if no command is provided an exception should be thrown", () => {
        //GIVEN WHEN THEN
        checkForErrorInFunction(() => new NpmExecution(undefined, [], "repositoryURL"), IllegalArgumentException);
    });

    it("command parameters are correctly delegated to the process", async () => {
        //GIVEN
        const mockedSpawn = new MockedSpawn();

        const itemUnderTest = new NpmExecution(
            "npmcommand",
            ["param1", "param2"],
            "theRepo",
            (command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions) =>
                mockedSpawn.mockedSpawnFunction(command, args, options)
        );
        //WHEN
        const result = itemUnderTest.execute();
        //exit the process
        await mockedSpawn.exit();
        await result;
        //THEN
        expect(mockedSpawn.command).toBe("npm");
        expect(mockedSpawn.args).toEqual(["npmcommand", "param1", "param2", "--registry=theRepo"]);
        expect(mockedSpawn.options.shell).toBeTruthy();
    });

    it("stdout is correctly handled", async () => {
        //GIVEN
        const mockedSpawn = new MockedSpawn();

        const itemUnderTest = new NpmExecution(
            "npmcommand",
            ["param1", "param2"],
            "theRepo",
            (command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions) =>
                mockedSpawn.mockedSpawnFunction(command, args, options)
        );
        let errorOccurred =false;
        //WHEN
        const result = itemUnderTest.execute();
        //exit the process
        await mockedSpawn.sendToStdOut("Std out ")
        await mockedSpawn.exit();
        
        //THEN
        const stdout = await result;
        expect(stdout).toBe("Std out ");
        
    });

    it("if exit declares error and nothing is written to stderr stdout text should be used in the exception", async () => {
        //GIVEN
        const mockedSpawn = new MockedSpawn();

        const itemUnderTest = new NpmExecution(
            "npmcommand",
            ["param1", "param2"],
            "theRepo",
            (command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions) =>
                mockedSpawn.mockedSpawnFunction(command, args, options)
        );
        let errorOccurred =false;
        //WHEN
        const result = itemUnderTest.execute();
        //exit the process
        await mockedSpawn.sendToStdOut("Std out  as error")
        await mockedSpawn.exit(1);
        
        //THEN
        await result.catch(err=>{
            expect(err).toBeDefined();
            expect(err instanceof Error).toBeTruthy();
            expect(err.message).toBe('Std out  as error');
            errorOccurred = true;
        });

        expect(errorOccurred).toBeTruthy(`An Error has to occurr`);
        
    });


    it("stderr is correctly handled", async () => {
        //GIVEN
        const mockedSpawn = new MockedSpawn();

        const itemUnderTest = new NpmExecution(
            "npmcommand",
            ["param1", "param2"],
            "theRepo",
            (command: string, args?: ReadonlyArray<string>, options?: cp.SpawnOptions) =>
                mockedSpawn.mockedSpawnFunction(command, args, options)
        );
        let errorOccurred =false;
        //WHEN
        const result = itemUnderTest.execute();
        //exit the process
        await mockedSpawn.sendToStdErr("Error Occurred")
        await mockedSpawn.exit(1);
        
        //THEN
        await result.catch(err=>{
            expect(err).toBeDefined();
            expect(err instanceof Error).toBeTruthy();
            expect(err.message).toBe('Error Occurred');
            errorOccurred = true;
        });

        expect(errorOccurred).toBeTruthy(`An Error has to occurr`);
        
    });


    it("test that undefined args array is supported", async () => {
        //GIVEN
        const npmExecution = new NpmExecution("--version", undefined, "repouri");
        //WHEN
        const result = await npmExecution.execute();
        //THEN
        expect(result).toBeDefined();
    });

    it("if command is not recognized an error is thrown", async () => {
        //GIVEN
        const npmExecution = new NpmExecution("notdefined command", undefined, "repouri");
        //WHEN THEN
        await checkForErrorInAsyncFunction(() => npmExecution.execute());
    });

    it("if error occurrs in process error is thrown", async () => {
        //GIVEN
        const npmExecution = new NpmExecution("search", undefined, "repouri");
        //WHEN THEN
        await checkForErrorInAsyncFunction(() => npmExecution.execute());
    });
});
