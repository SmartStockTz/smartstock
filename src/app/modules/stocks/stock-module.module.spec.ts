import { StockModuleModule } from './stock-module.module';

describe('StockModuleModule', () => {
  let stockModuleModule: StockModuleModule;

  beforeEach(() => {
    stockModuleModule = new StockModuleModule();
  });

  it('should create an instance', () => {
    expect(stockModuleModule).toBeTruthy();
  });
});
