export interface Package{
    name:string;
    description:string;

    /**
     * Todo: use an array of maintainers
     */
    author:string;

    /**
     * Todo: use SemVer here
     */
    version:string;

}

export class PackageFactory{

    public createPackage(name:string,description:string,author:string,version:string):Package{
        return new PackageImpl(name,description,author,version);
    }
}

export class PackageImpl implements Package{
    readonly name: string;
    readonly description: string;
    readonly author: string;
    readonly version: string;

    constructor (name:string,description:string,author:string,version:string){
        this.name = name;
        this.description = description;
        this.author = author;
        this.version = version;
    }


}