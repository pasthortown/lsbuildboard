import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectAttachmentComponent } from './projectattachment.component';

const routes: Routes = [
   {
      path: '',
      component: ProjectAttachmentComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ProjectAttachmentRoutingModule {}
