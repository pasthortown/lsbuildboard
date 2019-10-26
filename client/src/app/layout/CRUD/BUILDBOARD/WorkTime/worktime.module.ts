import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkTimeRoutingModule } from './worktime-routing.module';
import { WorkTimeComponent } from './worktime.component';
import { WorkTimeService } from './../../../../services/CRUD/BUILDBOARD/worktime.service';
import { environment } from 'src/environments/environment';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { UserService } from './../../../../services/profile/user.service';

@NgModule({
   imports: [CommonModule,
             WorkTimeRoutingModule,
             FormsModule],
   declarations: [WorkTimeComponent],
   providers: [
               TaskService,
               UserService,
               WorkTimeService
               ]
})
export class WorkTimeModule {}