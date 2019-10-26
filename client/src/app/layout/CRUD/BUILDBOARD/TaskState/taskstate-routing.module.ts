import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskStateComponent } from './taskstate.component';

const routes: Routes = [
   {
      path: '',
      component: TaskStateComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TaskStateRoutingModule {}
