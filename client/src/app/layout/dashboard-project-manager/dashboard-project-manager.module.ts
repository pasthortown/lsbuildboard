import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardProjectManagerRoutingModule } from './dashboard-project-manager-routing.module';
import { DashboardProjectManagerComponent } from './dashboard-project-manager.component';

@NgModule({
    imports: [CommonModule, DashboardProjectManagerRoutingModule],
    declarations: [DashboardProjectManagerComponent]
})
export class DashboardProjectManagerModule {}
