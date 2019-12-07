// 一个柯里化函数
let add = (x: number) => (y: number) => x + y;

// 简单使用
add(123)(456);

// 部分应用
let add123 = add(123);

// fully apply the function
add123(456);