import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriorityComponent } from './priority.component';

const routes: Routes = [
   {
      path: '',
      component: PriorityComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PriorityRoutingModule {}
