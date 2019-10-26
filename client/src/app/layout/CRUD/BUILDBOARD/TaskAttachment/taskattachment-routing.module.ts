import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskAttachmentComponent } from './taskattachment.component';

const routes: Routes = [
   {
      path: '',
      component: TaskAttachmentComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TaskAttachmentRoutingModule {}
