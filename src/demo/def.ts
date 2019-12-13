import 'reflect-metadata';
import {OBJ_DEF_CLS} from './keys';
import {ObjectDefinitionOptions} from './interface';

/**
 *初始化属性
 *
 * @export
 * @param {*} target
 * @returns {ObjectDefinitionOptions}
 */
export function initOrGetObjectDefProps(target:any):  ObjectDefinitionOptions {
    const result = Reflect.hasOwnMetadata(OBJ_DEF_CLS, target);

    if (!result){
        Reflect.defineMetadata(OBJ_DEF_CLS, {}, target);
    }
    return Reflect.getMetadata(OBJ_DEF_CLS, target);
}