import { TaskModule } from './task.module';

describe('TaskModule', () => {
   let blackPageModule: TaskModule;

   beforeEach(() => {
      blackPageModule = new TaskModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});