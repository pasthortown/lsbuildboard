import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleAssigmentComponent } from './roleassigment.component';

const routes: Routes = [
   {
      path: '',
      component: RoleAssigmentComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class RoleAssigmentRoutingModule {}
