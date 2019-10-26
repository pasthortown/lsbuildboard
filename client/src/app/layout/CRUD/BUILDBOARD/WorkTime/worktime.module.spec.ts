import { WorkTimeModule } from './worktime.module';

describe('WorkTimeModule', () => {
   let blackPageModule: WorkTimeModule;

   beforeEach(() => {
      blackPageModule = new WorkTimeModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});