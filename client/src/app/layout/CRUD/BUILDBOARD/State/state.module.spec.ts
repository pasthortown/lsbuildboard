import { StateModule } from './state.module';

describe('StateModule', () => {
   let blackPageModule: StateModule;

   beforeEach(() => {
      blackPageModule = new StateModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});