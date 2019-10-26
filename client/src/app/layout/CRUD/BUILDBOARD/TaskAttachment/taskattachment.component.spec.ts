import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskAttachmentComponent } from './taskattachment.component';

describe('TaskAttachmentComponent', () => {
   let component: TaskAttachmentComponent;
   let fixture: ComponentFixture<TaskAttachmentComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TaskAttachmentComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TaskAttachmentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});