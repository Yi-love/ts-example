import 'reflect-metadata';
import {TAGGED_CLS, INJECT_TAG,PRELOAD_MODULE_KEY,WEB_ROUTER_KEY, CONTROLLER_DATA_KEY, CONTROLLER_KEY, PROVIDE_KEY} from './keys';
import {DUPLICATED_INJECTABLE_DECORATOR} from './errMsg';
import {ObjectIdentifier, TagClsMetadata} from './interface';
import {initOrGetObjectDefProps} from './def';
import {Metadata} from './metadata';
import {tagProperty} from './decorator';
import {saveModule} from './decoratorManager';

const camelCase = require('camelcase');

export function provide(identifier?: ObjectIdentifier){
    console.log('[ioc:provide] create provide...', identifier);
    return function (target:any){
        console.log('[ioc]:provide running...', target);
        if (typeof target === 'object' && target.constructor) {
            target = target.constructor;
        }
        // 如果已经存在
        if (Reflect.hasOwnMetadata(TAGGED_CLS, target)) {
            throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
        }

        console.log('[ioc:provide] name: ', identifier, target.name);
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

        saveModule(PROVIDE_KEY, target);

        return target;
    }
}

export function controller(prefix: string){
    console.log('[ioc:controller] create controller.....', prefix);
    return (target: any) => {
        console.log('[ioc:controller] run controller.....', target);

        saveModule(CONTROLLER_KEY, target);
        if (typeof target === 'object' && target.constructor) {
            target = target.constructor;
        }
        // for class
        if (!Reflect.hasMetadata(PRELOAD_MODULE_KEY, target)) {
            Reflect.defineMetadata(PRELOAD_MODULE_KEY, new Map(), target);
        }
        let originMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
        console.log('[controller] map------------>', originMap);
        originMap.set(CONTROLLER_DATA_KEY, {prefix});

        console.log('[ioc:controller] controller map....------>', originMap);
    };
  }

export function inject(identifier?: ObjectIdentifier){
    console.log('[ioc:inject] create inject...', identifier);
    return function(target:any, key:string){
        console.log('[ioc]:inject running...', target, key);
        if (!identifier) {
            identifier = key;
        }
        const metadata = new Metadata(INJECT_TAG, identifier);
        tagProperty(target, key, metadata);
    }
}

export function get(path: string){
    console.log('[ioc:get] create get...', path);
    return function(target:any, key:string, descriptor: PropertyDescriptor){
        console.log('[ioc]:get running...', target, key, descriptor);
        // for class
        if (typeof target === 'object' && target.constructor) {
            target = target.constructor;
        }
        if (!Reflect.hasMetadata(PRELOAD_MODULE_KEY, target)) {
            Reflect.defineMetadata(PRELOAD_MODULE_KEY, new Map(), target);
        }
        let originMap = Reflect.getMetadata(PRELOAD_MODULE_KEY, target);
        console.log('[get] start------------>', originMap);
        if (!originMap.has(WEB_ROUTER_KEY)) {
            originMap.set(WEB_ROUTER_KEY, []);
        }
        originMap.get(WEB_ROUTER_KEY).push({
            path: path,
            method: key,
            requestMethod: 'get'
        });
        console.log('[get] end------------>', originMap, Reflect.getMetadata(PRELOAD_MODULE_KEY, target));
        return descriptor;
    }
}

export interface Context{
    body: any;
    render(name:string): Promise<string>;
}
