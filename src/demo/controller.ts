import {provide, inject, controller , Context, get} from './ioc';

@provide()
@controller('/stock')
export class StockController{
    @inject()
    ctx: Context;

    @get('/')
    async index(){
        console.log('[StockController] is run....', this.ctx);
    }
}
