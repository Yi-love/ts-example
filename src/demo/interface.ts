export type ObjectIdentifier = string;
export type Scope = 'Singleton' | 'Request' | 'Prototype';
export type Locale = string;

/**
 * 多语言支持接口
 */
export interface IMessageSource {
    get(code: string, args?: any[], defaultMessage?: string, locale?: Locale): string;
}

export interface TagClsMetadata {
    id: string;
    originName: string;
}

export interface ObjectDefinitionOptions {
    isAsync?: boolean;
    initMethod?: string;
    destroyMethod?: string;
    scope?: Scope;
    constructorArgs?: IManagedInstance[];
    // 是否自动装配
    isAutowire?: boolean;
}

export interface TagPropsMetadata {
    key: string | number | symbol;
    value: any;
}

export interface ReflectResult {
    [key: string]: TagPropsMetadata[];
}

/**
 * 内部管理的属性、json、ref等解析实例存储
 */
export interface IManagedInstance {
    type: string;
}

export interface Context{
    body: any;
    render(name:string): Promise<string>;
}

export interface RouterOption {
    path: string,
    method: string,
    requestMethod: string
}