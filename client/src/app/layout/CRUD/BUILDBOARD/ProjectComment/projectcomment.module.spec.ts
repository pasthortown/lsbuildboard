import { ProjectCommentModule } from './projectcomment.module';

describe('ProjectCommentModule', () => {
   let blackPageModule: ProjectCommentModule;

   beforeEach(() => {
      blackPageModule = new ProjectCommentModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});