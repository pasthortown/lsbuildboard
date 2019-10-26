import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { environment } from 'src/environments/environment';
import { HistoryService } from './../../../../services/CRUD/BUILDBOARD/history.service';
import { UserService } from './../../../../services/profile/user.service';
import { PriorityService } from './../../../../services/CRUD/BUILDBOARD/priority.service';
import { CKEditorModule } from 'ngx-ckeditor';
import { ProjectService } from 'src/app/services/CRUD/BUILDBOARD/project.service';

@NgModule({
   imports: [CommonModule,
             TaskRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [TaskComponent],
   providers: [
               HistoryService,
               ProjectService,
               UserService,
               PriorityService,
               TaskService
               ]
})
export class TaskModule {}