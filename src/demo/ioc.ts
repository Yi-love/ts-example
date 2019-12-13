import 'reflect-metadata';
import {TAGGED_CLS, INJECT_TAG,PRELOAD_MODULE_KEY,WEB_ROUTER_KEY, CONTROLLER_DATA_KEY, CONTROLLER_KEY, PROVIDE_KEY} from './keys';
import {DUPLICATED_INJECTABLE_DECORATOR} from './errMsg';
import {ObjectIdentifier, TagClsMetadata} from './interface';
import {initOrGetObjectDefProps} from './def';
import {Metadata} from './metadata';
import {tagProperty} from './decorator';
import {saveModule} from './decoratorManager';

const camelCase = require('camelcase');


/**
 *提供给外部使用
 *
 * @export
 * @param {ObjectIdentifier} [identifier]
 * @returns
 */
export function provide(identifier?: ObjectIdentifier){
    return function (target:any){
        if (typeof target === 'object' && target.constructor) {
            target = target.constructor;
        }
        // 如果已经存在
        if (Reflect.hasOwnMetadata(TAGGED_CLS, target)) {
            throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
        }

        //如果不设置名称，默认使用驼峰名称注入
        if (!identifier) {
            identifier = camelCase(target.name);
        }

        // 定义一个对象
        Reflect.defineMetadata(TAGGED_CLS, {
            id: identifier,
            originName: target.name
        } as TagClsMetadata, target);

        initOrGetObjectDefProps(target);

        // 缓存
        saveModule(PROVIDE_KEY, target);

        return target;
    }
}

/**
 *controller 装饰器
 *
 * @export
 * @param {string} prefix  路由前缀
 * @returns
 */
export function controller(prefix: string){
    return (target: any) => {
        //缓存
        saveModule(CONTROLLER_KEY, target);

        if (typeof target === 'object' && target.constructor) {
            target = target.constructor;
        }
        // for class
        if (!Reflect.hasMetadata(PRELOAD_MODULE_KEY, target)) {
            Reflect.defineMetadata(PRELOAD_MODULE_KEY, new Map(), target);
        }
        // 缓存controller 参数
        let originMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
        originMap.set(CONTROLLER_DATA_KEY, {prefix});
    };
}

/**
 *inject 注入装饰器，表示当前参数依赖
 *
 * @export
 * @param {ObjectIdentifier} [identifier]
 * @returns
 */
export function inject(identifier?: ObjectIdentifier){
    return function(target:any, key:string){
        if (!identifier) {
            identifier = key;
        }
        const metadata = new Metadata(INJECT_TAG, identifier);
        // 缓存依赖
        tagProperty(target, key, metadata);
    }
}

/**
 * get方法装饰器
 *
 * @export
 * @param {string} path
 * @returns
 */
export function get(path: string){
    return function(target:any, key:string, descriptor: PropertyDescriptor){
        // for class
        if (typeof target === 'object' && target.constructor) {
            target = target.constructor;
        }
        if (!Reflect.hasMetadata(PRELOAD_MODULE_KEY, target)) {
            Reflect.defineMetadata(PRELOAD_MODULE_KEY, new Map(), target);
        }
        // 为当前controller模块,创建方法map
        let originMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
        if (!originMap.has(WEB_ROUTER_KEY)) {
            originMap.set(WEB_ROUTER_KEY, []);
        }
        // 将方法依赖缓存
        originMap.get(WEB_ROUTER_KEY).push({
            path: path,
            method: key,
            requestMethod: 'get'
        });
        return descriptor;
    }
}
