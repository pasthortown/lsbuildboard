import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { environment } from 'src/environments/environment';
import { CKEditorModule } from 'ngx-ckeditor';
import { ProjectAttachmentService } from 'src/app/services/CRUD/BUILDBOARD/projectattachment.service';

@NgModule({
   imports: [CommonModule,
             ProjectRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [ProjectComponent],
   providers: [
               ProjectService,
               ProjectAttachmentService
               ]
})
export class ProjectModule {}