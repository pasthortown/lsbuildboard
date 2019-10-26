import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStateRoutingModule } from './taskstate-routing.module';
import { TaskStateComponent } from './taskstate.component';
import { TaskStateService } from './../../../../services/CRUD/BUILDBOARD/taskstate.service';
import { environment } from 'src/environments/environment';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { StateService } from './../../../../services/CRUD/BUILDBOARD/state.service';
import { UserService } from './../../../../services/profile/user.service';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
   imports: [CommonModule,
             TaskStateRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [TaskStateComponent],
   providers: [
               TaskService,
               StateService,
               UserService,
               TaskStateService
               ]
})
export class TaskStateModule {}