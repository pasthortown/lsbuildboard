import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCommentComponent } from './projectcomment.component';

const routes: Routes = [
   {
      path: '',
      component: ProjectCommentComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ProjectCommentRoutingModule {}
