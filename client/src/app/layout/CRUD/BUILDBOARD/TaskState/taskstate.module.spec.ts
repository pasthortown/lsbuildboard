import { TaskStateModule } from './taskstate.module';

describe('TaskStateModule', () => {
   let blackPageModule: TaskStateModule;

   beforeEach(() => {
      blackPageModule = new TaskStateModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});