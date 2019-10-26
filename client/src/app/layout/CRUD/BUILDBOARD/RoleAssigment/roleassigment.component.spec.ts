import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleAssigmentComponent } from './roleassigment.component';

describe('RoleAssigmentComponent', () => {
   let component: RoleAssigmentComponent;
   let fixture: ComponentFixture<RoleAssigmentComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RoleAssigmentComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RoleAssigmentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});