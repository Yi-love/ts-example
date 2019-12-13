import 'reflect-metadata';
import {TagPropsMetadata, ReflectResult} from './interface';
import {TAGGED_PROP} from './keys';
import {INVALID_DECORATOR_OPERATION, DUPLICATED_METADATA} from './errMsg';

export function tagProperty(annotationTarget: any, propertyName: string, metadata: TagPropsMetadata) {
    _tagParameterOrProperty(TAGGED_PROP, annotationTarget.constructor, propertyName, metadata);
}
  
function _tagParameterOrProperty(metadataKey: string, annotationTarget: any, propertyName: string, metadata: TagPropsMetadata, parameterIndex?: number) {
  
    let paramsOrPropertiesMetadata: ReflectResult = {};
    const isParameterDecorator = (typeof parameterIndex === 'number');
    const key: string = (parameterIndex !== undefined && isParameterDecorator) ? parameterIndex.toString() : propertyName;
  
    if (isParameterDecorator && propertyName !== undefined) {
        throw new Error(INVALID_DECORATOR_OPERATION);
    }
  
    if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
        paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
    }
  
    let paramOrPropertyMetadata: TagPropsMetadata[] = paramsOrPropertiesMetadata[key];
  
    if (!Array.isArray(paramOrPropertyMetadata)) {
        paramOrPropertyMetadata = [];
    } else {
        for (const m of paramOrPropertyMetadata) {
            if (m.key === metadata.key) {
                throw new Error(`${DUPLICATED_METADATA} ${m.key.toString()}`);
            }
        }
    }
  
    // 设置属性
    paramOrPropertyMetadata.push(metadata);
    paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
  }