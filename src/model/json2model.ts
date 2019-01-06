export interface Json2Model<MODEL>{
    toModel(jsonString:string):MODEL;
    toJson(model:MODEL):string;
}