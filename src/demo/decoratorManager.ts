export type decoratorKey = string | symbol;

/**
 *管理依赖
 *
 * @export
 * @class DecoratorManager
 * @extends {Map}
 */
export class DecoratorManager extends Map {
    saveModule(key:any, module:any) {
        if (!this.has(key)) {
            this.set(key, new Set());
        }
        this.get(key).add(module);
    }
    listModule(key: any) {
        return Array.from(this.get(key) || {});
    }
}

const manager = new DecoratorManager();

/**
 * save module to inner map
 * @param decoratorNameKey
 * @param target
 */
export function saveModule(decoratorNameKey: decoratorKey, target:any) {
    return manager.saveModule(decoratorNameKey, target);
}
  
/**
 * list module from decorator key
 * @param decoratorNameKey
 */
export function listModule(decoratorNameKey: decoratorKey) {
    return manager.listModule(decoratorNameKey);
}