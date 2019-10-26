import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PriorityRoutingModule } from './priority-routing.module';
import { PriorityComponent } from './priority.component';
import { PriorityService } from './../../../../services/CRUD/BUILDBOARD/priority.service';
import { environment } from 'src/environments/environment';

@NgModule({
   imports: [CommonModule,
             PriorityRoutingModule,
             FormsModule],
   declarations: [PriorityComponent],
   providers: [
               PriorityService
               ]
})
export class PriorityModule {}