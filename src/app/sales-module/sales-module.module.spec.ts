import { SalesModuleModule } from './sales-module.module';

describe('SalesModuleModule', () => {
  let salesModuleModule: SalesModuleModule;

  beforeEach(() => {
    salesModuleModule = new SalesModuleModule();
  });

  it('should create an instance', () => {
    expect(salesModuleModule).toBeTruthy();
  });
});
