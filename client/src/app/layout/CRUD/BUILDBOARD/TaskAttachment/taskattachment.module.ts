import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskAttachmentRoutingModule } from './taskattachment-routing.module';
import { TaskAttachmentComponent } from './taskattachment.component';
import { TaskAttachmentService } from './../../../../services/CRUD/BUILDBOARD/taskattachment.service';
import { environment } from 'src/environments/environment';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';

@NgModule({
   imports: [CommonModule,
             TaskAttachmentRoutingModule,
             FormsModule],
   declarations: [TaskAttachmentComponent],
   providers: [
               TaskService,
               TaskAttachmentService
               ]
})
export class TaskAttachmentModule {}