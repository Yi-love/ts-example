// 装饰器
function provide(name?:string) {
    return function(target:any){
        console.log('[provide]------>', name , target);
        return target;
    };
}
function configurable(value:boolean){
    return function(target:any,key:string,descriptor:PropertyDescriptor){
        console.log('[configurable]----->', target , key ,descriptor);
        descriptor.configurable = value;
    }
}
function inject(name?:string){
    return function(target:any,key:string){
        console.log('[inject]----->', name,  target, key);
    }
}
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    console.log('[required]------>', target, propertyKey, parameterIndex);
}

@provide()//类装饰器
export class Computer {
    x: number;

    @inject()//属性装饰器
    y:number;
    
    @configurable(true)//方法装饰器
    getTotal(@required z: number){//参数装饰器
        return this.x * this.y * z;
    }
}

let computer: Computer = new Computer();

console.log('total------------>', computer.getTotal(1));