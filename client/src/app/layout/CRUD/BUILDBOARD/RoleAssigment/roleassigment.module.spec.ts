import { RoleAssigmentModule } from './roleassigment.module';

describe('RoleAssigmentModule', () => {
   let blackPageModule: RoleAssigmentModule;

   beforeEach(() => {
      blackPageModule = new RoleAssigmentModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});