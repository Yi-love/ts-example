import 'reflect-metadata';
const Koa = require('koa');
const KoaRouter = require('koa-router');

import  {constructorMap} from './init';
import { TagPropsMetadata, RouterOption }from  './interface';

const app = new Koa();

import {TAGGED_CLS, PRELOAD_MODULE_KEY, CONTROLLER_KEY, CONTROLLER_DATA_KEY, WEB_ROUTER_KEY} from './keys';
import {listModule} from './decoratorManager';


/**
 *
 *针对不同的控制器创建不同前缀的路由列表
 * @param {*} controllerOption
 * @returns
 */
function createRouter(controllerOption: any){
    let router = new KoaRouter();
    if (controllerOption.prefix){
        router.prefix(controllerOption.prefix);
        return router;
    }
    return null;
}
/**
 * 获取路由数据，创建路由列表
 *
 * @param {*} target
 * @param {string} controllerId
 * @returns
 */
function preRegisterRouter(target: any, controllerId: string){

    //获取路由对象
    let originModuleMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
    // 获取路由对象，路由数据
    const controllerOption = originModuleMap.get(CONTROLLER_DATA_KEY);
    //创建路由
    let router = createRouter(controllerOption);
    if (router){
        let originMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
        let routerOption: RouterOption[] = originMap.get(WEB_ROUTER_KEY);
        if (routerOption && typeof routerOption[Symbol.iterator] === 'function'){
            // 路由列表生成
            for (const webRouter of routerOption) {
                //路由定义
                router[webRouter.requestMethod](webRouter.path, generateController(controllerId, webRouter.method));
            }
        }
        return router;
    }
    return null;
}

/**
 *生成路由对应的回调函数
 *
 * @param {string} controllerId
 * @param {string} method
 * @returns
 */
function generateController(controllerId: string, method: string){
    // koa controller处理回调
    return async (ctx: any) => {
        let classList : any = {};
    
        /**
         *创建controller实例，递归实例化依赖
         *
         * @param {*} identifier
         * @param {*} ctx
         * @returns
         */
        function createRealClass(identifier: any, ctx:any){
            if (identifier === 'ctx') {
                return ctx;
            }
            if (classList[identifier]){
                return classList[identifier];
            }
    
            // 创建controller实例
            let cls = new constructorMap[identifier].creater();
            
            classList[identifier] = cls;
            if (constructorMap[identifier].properties){
                let props = constructorMap[identifier].properties;
                // 如果存在依赖，递归实例化依赖
                for (const prop in props){
                    let metadatas: TagPropsMetadata[] = props[prop];
                    for (let meta of metadatas){
                        cls[prop] = createRealClass(meta.value, ctx);
                    }
                }
            }
            return cls;
        }
        console.log('[resquest].........', controllerId, method);
        //创建对象
        let contrl = createRealClass(controllerId, ctx);
        //执行方法
        await contrl[method].apply(contrl);
    };
}

/**
 *初始化创建前端路由
 *
 * @returns
 */
function preLoad (app: any){
    // 获取所有controller
    const controllerModules = listModule(CONTROLLER_KEY);
    for (const module of controllerModules) {
        const metaData = Reflect.getMetadata(TAGGED_CLS, module as any);
        let providerId ='';
        if (metaData) {
            providerId = metaData.id;
        }
        //根据不同controller创建路由
        const router = preRegisterRouter(module, providerId);
        if (router){
            app.use(router.routes());
        }
    }
}

preLoad(app);
//启动
app.listen(3000);

console.log('[app] is running...');