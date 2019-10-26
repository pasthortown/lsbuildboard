import { RoleModule } from './role.module';

describe('RoleModule', () => {
   let blackPageModule: RoleModule;

   beforeEach(() => {
      blackPageModule = new RoleModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});