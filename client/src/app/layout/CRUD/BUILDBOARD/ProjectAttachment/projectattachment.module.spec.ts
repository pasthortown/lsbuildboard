import { ProjectAttachmentModule } from './projectattachment.module';

describe('ProjectAttachmentModule', () => {
   let blackPageModule: ProjectAttachmentModule;

   beforeEach(() => {
      blackPageModule = new ProjectAttachmentModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});