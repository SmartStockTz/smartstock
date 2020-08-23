import {LibModule} from '../lib.module';


describe('CommonModuleModule', () => {
  let commonModuleModule: LibModule;

  beforeEach(() => {
    commonModuleModule = new LibModule();
  });

  it('should create an instance', () => {
    expect(commonModuleModule).toBeTruthy();
  });
});
