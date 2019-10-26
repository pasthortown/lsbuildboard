import { PriorityModule } from './priority.module';

describe('PriorityModule', () => {
   let blackPageModule: PriorityModule;

   beforeEach(() => {
      blackPageModule = new PriorityModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});