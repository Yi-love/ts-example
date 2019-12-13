import {provide} from './ioc';

@provide('stockService')
export class StockService{
    /**
     *根据code获取股票
     *
     * @param {StockOptons} options
     * @returns {Promise<StockResult>}
     * @memberof StockService
     */
    async getStock(options: any): Promise<any>{
        return {
            code: options.code,
            name: '腾讯',
            marketId: 1
        };
    }
}