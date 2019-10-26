import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { RoleService } from './../../../../services/CRUD/BUILDBOARD/role.service';
import { environment } from 'src/environments/environment';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
   imports: [CommonModule,
             RoleRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [RoleComponent],
   providers: [
               RoleService
               ]
})
export class RoleModule {}