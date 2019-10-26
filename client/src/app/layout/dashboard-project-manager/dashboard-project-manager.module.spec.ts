import { DashboardProjectManagerModule } from './dashboard-project-manager.module';

describe('DashboardProjectManagerModule', () => {
    let blackPageModule: DashboardProjectManagerModule;

    beforeEach(() => {
        blackPageModule = new DashboardProjectManagerModule();
    });

    it('should create an instance', () => {
        expect(blackPageModule).toBeTruthy();
    });
});
