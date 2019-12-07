let variable: {bar: number};

function poo(variable:{bar:number}) {

}

// 类型注解
interface Too {
    x: number,
    y: number
}

function koo(t: Too): Too {
    return t;
}

// 可选参数
function ko(x:number, y?:number): number {
    return x * (y || 0);
}

//重载
function po(x:number): number;
function po(x:number, y?:number){
    return x * (y || 0);
}

// 函数声明
type LongHand = {
    (a: number): number;
};

type ShortHand = (a:number) => number;


let goo: LongHand = function(a: number){
    return a;
}

goo(5555);

