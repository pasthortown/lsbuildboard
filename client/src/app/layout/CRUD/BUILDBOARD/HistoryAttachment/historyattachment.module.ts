import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoryAttachmentRoutingModule } from './historyattachment-routing.module';
import { HistoryAttachmentComponent } from './historyattachment.component';
import { HistoryAttachmentService } from './../../../../services/CRUD/BUILDBOARD/historyattachment.service';
import { environment } from 'src/environments/environment';
import { HistoryService } from './../../../../services/CRUD/BUILDBOARD/history.service';

@NgModule({
   imports: [CommonModule,
             HistoryAttachmentRoutingModule,
             FormsModule],
   declarations: [HistoryAttachmentComponent],
   providers: [
               HistoryService,
               HistoryAttachmentService
               ]
})
export class HistoryAttachmentModule {}