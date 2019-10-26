import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { ProjectCommentService } from './../../../../services/CRUD/BUILDBOARD/projectcomment.service';
import { ProjectComment } from './../../../../models/BUILDBOARD/ProjectComment';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { Project } from './../../../../models/BUILDBOARD/Project';

import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';


@Component({
   selector: 'app-projectcomment',
   templateUrl: './projectcomment.component.html',
   styleUrls: ['./projectcomment.component.scss']
})
export class ProjectCommentComponent implements OnInit {
   project_comments: ProjectComment[] = [];
   project_commentSelected: ProjectComment = new ProjectComment();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   projects: Project[] = [];
   users: User[] = [];
   constructor(
               private toastr: ToastrManager,
               private projectDataService: ProjectService,
               private userDataService: UserService,
               private project_commentDataService: ProjectCommentService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getProject();
      this.getUser();
   }

   selectProjectComment(project_comment: ProjectComment) {
      this.project_commentSelected = project_comment;
   }

   getProject() {
      this.projects = [];
      this.projectDataService.get().then( r => {
         this.projects = r as Project[];
      }).catch( e => console.log(e) );
   }

   getUser() {
      this.users = [];
      this.userDataService.get().then( r => {
         this.users = r as User[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getProjectComments();
   }

   getProjectComments() {
      this.project_comments = [];
      this.project_commentSelected = new ProjectComment();
      this.project_commentSelected.project_id = 0;
      this.project_commentSelected.user_id = 0;
      this.project_commentDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.project_comments = r.data as ProjectComment[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newProjectComment() {
      this.project_commentSelected = new ProjectComment();
      this.project_commentSelected.project_id = 0;
      this.project_commentSelected.user_id = 0;
      this.showDialog = true;
   }

   editProjectComment() {
      if (typeof this.project_commentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteProjectComment() {
      if (typeof this.project_commentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.project_commentDataService.delete(this.project_commentSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getProjectComments();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.project_commentDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_ProjectComments.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.project_commentDataService.get().then( r => {
         const backupData = r as ProjectComment[];
         let output = 'id;description;project_id;user_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.description + ';' + element.project_id + ';' + element.user_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_ProjectComments.csv');
      }).catch( e => console.log(e) );
   }

   decodeUploadFile(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            const fileBytes = reader.result.toString().split(',')[1];
            const newData = JSON.parse(decodeURIComponent(escape(atob(fileBytes)))) as any[];
            this.project_commentDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      if (typeof this.project_commentSelected.id === 'undefined') {
         this.project_commentDataService.post(this.project_commentSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getProjectComments();
         }).catch( e => console.log(e) );
      } else {
         this.project_commentDataService.put(this.project_commentSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getProjectComments();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}