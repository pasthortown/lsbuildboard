import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { HistoryService } from './../../../../services/CRUD/BUILDBOARD/history.service';
import { environment } from 'src/environments/environment';
import { StateService } from './../../../../services/CRUD/BUILDBOARD/state.service';
import { UserService } from './../../../../services/profile/user.service';
import { PriorityService } from './../../../../services/CRUD/BUILDBOARD/priority.service';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
   imports: [CommonModule,
             HistoryRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [HistoryComponent],
   providers: [
               StateService,
               UserService,
               PriorityService,
               ProjectService,
               HistoryService
               ]
})
export class HistoryModule {}