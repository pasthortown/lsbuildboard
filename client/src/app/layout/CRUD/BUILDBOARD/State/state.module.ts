import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateRoutingModule } from './state-routing.module';
import { StateComponent } from './state.component';
import { StateService } from './../../../../services/CRUD/BUILDBOARD/state.service';
import { environment } from 'src/environments/environment';

@NgModule({
   imports: [CommonModule,
             StateRoutingModule,
             FormsModule],
   declarations: [StateComponent],
   providers: [
               StateService
               ]
})
export class StateModule {}