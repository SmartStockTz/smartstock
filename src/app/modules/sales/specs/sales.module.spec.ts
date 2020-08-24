import { SalesModule } from '../sales.module';

describe('SalesModuleModule', () => {
  let salesModuleModule: SalesModule;

  beforeEach(() => {
    salesModuleModule = new SalesModule();
  });

  it('should create an instance', () => {
    expect(salesModuleModule).toBeTruthy();
  });
});
