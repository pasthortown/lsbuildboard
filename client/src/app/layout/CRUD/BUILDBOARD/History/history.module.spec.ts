import { HistoryModule } from './history.module';

describe('HistoryModule', () => {
   let blackPageModule: HistoryModule;

   beforeEach(() => {
      blackPageModule = new HistoryModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});