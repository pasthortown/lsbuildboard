import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryAttachmentComponent } from './historyattachment.component';

const routes: Routes = [
   {
      path: '',
      component: HistoryAttachmentComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class HistoryAttachmentRoutingModule {}
