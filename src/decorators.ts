// 装饰器
function provide(name?:string) {
    return function(target:any){
        console.log('[provide]------>', name , target);
        return target;
    };
}

function configurable(value:boolean){
    return function(a:any,b:string,c:PropertyDescriptor){
        console.log('[configurable]----->', a ,b ,c);
        c.configurable = value;
    }
}
function inject(name?:string){
    return function(a:any,b:string){
        console.log('[inject]----->', name,  a, b);
    }
}

@provide()
export class Coo {
    _gt: string;
    _color: string;
    
    @inject()
    xx:string;

    @configurable(true)
    getState(){
        return this._gt;
    }

}

let coco: Coo = new Coo();

console.log('getState------------>', coco.getState(), coco.xx);