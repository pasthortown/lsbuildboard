import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TaskService } from 'src/app/services/CRUD/BUILDBOARD/task.service';
import { TaskStateService } from 'src/app/services/CRUD/BUILDBOARD/taskstate.service';
import { TaskAttachmentService } from 'src/app/services/CRUD/BUILDBOARD/taskattachment.service';

@NgModule({
    imports: [CommonModule, MainRoutingModule],
    declarations: [MainComponent],
    providers: [TaskService, TaskStateService, TaskAttachmentService]
})
export class MainModule {}
