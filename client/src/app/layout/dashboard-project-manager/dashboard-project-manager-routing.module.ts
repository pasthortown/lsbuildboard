import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardProjectManagerComponent } from './dashboard-project-manager.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardProjectManagerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardProjectManagerRoutingModule {}
