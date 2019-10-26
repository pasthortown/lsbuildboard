import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectManagerComponent } from './dashboard-project-manager.component';

describe('DashboardProjectManagerComponent', () => {
    let component: DashboardProjectManagerComponent;
    let fixture: ComponentFixture<DashboardProjectManagerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardProjectManagerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardProjectManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
