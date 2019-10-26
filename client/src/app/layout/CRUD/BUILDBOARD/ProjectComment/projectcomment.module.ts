import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectCommentRoutingModule } from './projectcomment-routing.module';
import { ProjectCommentComponent } from './projectcomment.component';
import { ProjectCommentService } from './../../../../services/CRUD/BUILDBOARD/projectcomment.service';
import { environment } from 'src/environments/environment';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { UserService } from './../../../../services/profile/user.service';

@NgModule({
   imports: [CommonModule,
             ProjectCommentRoutingModule,
             FormsModule],
   declarations: [ProjectCommentComponent],
   providers: [
               ProjectService,
               UserService,
               ProjectCommentService
               ]
})
export class ProjectCommentModule {}