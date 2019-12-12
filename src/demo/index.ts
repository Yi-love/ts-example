import 'reflect-metadata';
import  './controller';
const Koa = require('koa');
const KoaRouter = require('koa-router');

const app = new Koa();

import {TAGGED_CLS, PRELOAD_MODULE_KEY, CONTROLLER_KEY, CONTROLLER_DATA_KEY, WEB_ROUTER_KEY} from './keys';
import {listModule} from './decoratorManager';

let controllerIds = [];

interface RouterOption {
    path: string,
    method: string,
    requestMethod: string
}

//  获取路由数据
function preRegisterRouter(target: any, controllerId: string){

    //获取路由前缀
    let originModuleMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
    const controllerOption = originModuleMap.get(CONTROLLER_DATA_KEY);
    console.log('[preRegisterRouter] controller option:', controllerOption);

    //创建路由
    let router = createRouter(controllerOption);
    if (router){
        let originMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
        let routerOption: RouterOption[] = originMap.get(WEB_ROUTER_KEY);

        console.log('[preRegisterRouter] get router option: ', routerOption);
        if (routerOption && typeof routerOption[Symbol.iterator] === 'function'){
            for (const webRouter of routerOption) {
                router[webRouter.requestMethod](webRouter.path, generateController(controllerId, webRouter.method));
            }
        }
        console.log('[preRegisterRouter] router is ok......', router);
        return router;
    }
    console.log('[preRegisterRouter] is no......');
    return null;
}

function generateController(controllerId: string, method: string){
    console.log('[generateController] controller init ....', controllerId , method);
    return async (ctx: any) => {
        console.log('[generateController] controller run ....', method);
        ctx.body = 'hello ioc';
    }
}

// 创建路由
function createRouter(controllerOption: any){
    let router = new KoaRouter();
    if (controllerOption.prefix){
        router.prefix(controllerOption.prefix);
        return router;
    }
    return null;
}

function preLoad (){
    const controllerModules = listModule(CONTROLLER_KEY);

    console.log('[preLoad]---------------------->', controllerModules);
    // implement @controller
    for (const module of controllerModules) {
        console.log('[preLoad] module------------>', module);
        const metaData = Reflect.getMetadata(TAGGED_CLS, module as any);
        let providerId ='';
        if (metaData) {
            providerId = metaData.id;
        }
        controllerIds.push(providerId);
        console.log('[preLoad] meta-------------------->', metaData);
        return preRegisterRouter(module, providerId);
    }
    console.log('[preLoad]  error-------------------->');
    return null;
}
let router = preLoad();
if (router){
    app.use(router.routes());
}else {
    app.use((ctx: any )=>{
        ctx.body = 'no body';
    });
}
app.listen(3000);