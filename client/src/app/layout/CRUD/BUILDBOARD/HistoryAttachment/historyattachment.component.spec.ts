import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryAttachmentComponent } from './historyattachment.component';

describe('HistoryAttachmentComponent', () => {
   let component: HistoryAttachmentComponent;
   let fixture: ComponentFixture<HistoryAttachmentComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [HistoryAttachmentComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(HistoryAttachmentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});