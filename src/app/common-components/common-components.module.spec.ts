import {CommonComponentsModule} from './common-components.module';


describe('CommonModuleModule', () => {
  let commonModuleModule: CommonComponentsModule;

  beforeEach(() => {
    commonModuleModule = new CommonComponentsModule();
  });

  it('should create an instance', () => {
    expect(commonModuleModule).toBeTruthy();
  });
});
