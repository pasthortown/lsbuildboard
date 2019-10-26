import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleAssigmentRoutingModule } from './roleassigment-routing.module';
import { RoleAssigmentComponent } from './roleassigment.component';
import { RoleAssigmentService } from './../../../../services/CRUD/BUILDBOARD/roleassigment.service';
import { environment } from 'src/environments/environment';
import { UserService } from './../../../../services/profile/user.service';
import { RoleService } from './../../../../services/CRUD/BUILDBOARD/role.service';

@NgModule({
   imports: [CommonModule,
             RoleAssigmentRoutingModule,
             FormsModule],
   declarations: [RoleAssigmentComponent],
   providers: [
               UserService,
               RoleService,
               RoleAssigmentService
               ]
})
export class RoleAssigmentModule {}