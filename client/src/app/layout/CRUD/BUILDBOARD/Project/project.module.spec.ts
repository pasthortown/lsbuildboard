import { ProjectModule } from './project.module';

describe('ProjectModule', () => {
   let blackPageModule: ProjectModule;

   beforeEach(() => {
      blackPageModule = new ProjectModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});