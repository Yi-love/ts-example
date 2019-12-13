import 'reflect-metadata';
import './controller';
import './service';

import {PROVIDE_KEY, TAGGED_CLS, TAGGED_PROP} from './keys';
import {listModule} from './decoratorManager';
import {TagClsMetadata} from './interface';
const classMap = listModule(PROVIDE_KEY);
const constructorMap : any = {};
for (const module of classMap) {
    let identifierObj: TagClsMetadata = Reflect.getMetadata(TAGGED_CLS ,module as any);
    let properties = Reflect.getMetadata(TAGGED_PROP, module as any);

    constructorMap[identifierObj.id] = {
        creater : module,
        properties
    }
}

export {constructorMap};