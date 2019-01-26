
export class BaseException extends Error{
    constructor(message?:string){
        const trueProto = new.target.prototype;
        super(message);
        Object.setPrototypeOf(this, trueProto);
    }
        
}

export class IllegalArgumentException extends BaseException{
    constructor(message?:string){
        super(message);
    }
}

 export function checkArgument(condition:boolean,message:string):void{
    if(!condition){
        throw new IllegalArgumentException(message);
    }
 }

export class JsonToModelException extends BaseException{
    constructor(property:string,object:any){
        super(`Property ${property} does not exist in JSON object. Available properties are ${Object.keys(object)}`);
    }
}

export class TypeException extends BaseException{
    constructor(expectedType:string,actualType:string){
        super(` ${expectedType} type is expected but was ${actualType}`);
    }
}

export function checkType(actualType:string,expectedType:string){
    if(actualType !== expectedType){
        throw new TypeException(actualType,expectedType);
    }
}


export function checkProperty(property:string,object:any):void{
    if(!object[property]){
        throw new JsonToModelException(property,object);
    }
}
