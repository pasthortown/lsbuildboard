import { HistoryAttachmentModule } from './historyattachment.module';

describe('HistoryAttachmentModule', () => {
   let blackPageModule: HistoryAttachmentModule;

   beforeEach(() => {
      blackPageModule = new HistoryAttachmentModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});