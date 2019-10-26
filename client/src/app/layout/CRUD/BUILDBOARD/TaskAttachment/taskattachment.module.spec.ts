import { TaskAttachmentModule } from './taskattachment.module';

describe('TaskAttachmentModule', () => {
   let blackPageModule: TaskAttachmentModule;

   beforeEach(() => {
      blackPageModule = new TaskAttachmentModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});