import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TaskService } from 'src/app/services/CRUD/BUILDBOARD/task.service';
import { TaskStateService } from 'src/app/services/CRUD/BUILDBOARD/taskstate.service';
import { TaskAttachmentService } from 'src/app/services/CRUD/BUILDBOARD/taskattachment.service';
import { ProjectService } from 'src/app/services/CRUD/BUILDBOARD/project.service';

@NgModule({
    imports: [CommonModule, MainRoutingModule, FormsModule],
    declarations: [MainComponent],
    providers: [TaskService, TaskStateService, TaskAttachmentService, ProjectService]
})
export class MainModule {}
