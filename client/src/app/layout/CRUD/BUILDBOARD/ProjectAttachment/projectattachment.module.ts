import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectAttachmentRoutingModule } from './projectattachment-routing.module';
import { ProjectAttachmentComponent } from './projectattachment.component';
import { ProjectAttachmentService } from './../../../../services/CRUD/BUILDBOARD/projectattachment.service';
import { environment } from 'src/environments/environment';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';

@NgModule({
   imports: [CommonModule,
             ProjectAttachmentRoutingModule,
             FormsModule],
   declarations: [ProjectAttachmentComponent],
   providers: [
               ProjectService,
               ProjectAttachmentService
               ]
})
export class ProjectAttachmentModule {}