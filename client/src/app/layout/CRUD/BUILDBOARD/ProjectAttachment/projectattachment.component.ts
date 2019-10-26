import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { ProjectAttachmentService } from './../../../../services/CRUD/BUILDBOARD/projectattachment.service';
import { ProjectAttachment } from './../../../../models/BUILDBOARD/ProjectAttachment';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { Project } from './../../../../models/BUILDBOARD/Project';


@Component({
   selector: 'app-projectattachment',
   templateUrl: './projectattachment.component.html',
   styleUrls: ['./projectattachment.component.scss']
})
export class ProjectAttachmentComponent implements OnInit {
   project_attachments: ProjectAttachment[] = [];
   project_attachmentSelected: ProjectAttachment = new ProjectAttachment();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   projects: Project[] = [];
   constructor(
               private toastr: ToastrManager,
               private projectDataService: ProjectService,
               private project_attachmentDataService: ProjectAttachmentService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getProject();
   }

   CodeFileProjectAttachment(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            this.project_attachmentSelected.project_attachment_file_name = file.name;
            this.project_attachmentSelected.project_attachment_file_type = file.type;
            this.project_attachmentSelected.project_attachment_file = reader.result.toString().split(',')[1];
         };
      }
   }

   selectProjectAttachment(project_attachment: ProjectAttachment) {
      this.project_attachmentSelected = project_attachment;
   }

   getProject() {
      this.projects = [];
      this.projectDataService.get().then( r => {
         this.projects = r as Project[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getProjectAttachments();
   }

   getProjectAttachments() {
      this.project_attachments = [];
      this.project_attachmentSelected = new ProjectAttachment();
      this.project_attachmentSelected.project_id = 0;
      this.project_attachmentDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.project_attachments = r.data as ProjectAttachment[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newProjectAttachment() {
      this.project_attachmentSelected = new ProjectAttachment();
      this.project_attachmentSelected.project_id = 0;
      this.showDialog = true;
   }

   editProjectAttachment() {
      if (typeof this.project_attachmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteProjectAttachment() {
      if (typeof this.project_attachmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.project_attachmentDataService.delete(this.project_attachmentSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getProjectAttachments();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.project_attachmentDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_ProjectAttachments.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.project_attachmentDataService.get().then( r => {
         const backupData = r as ProjectAttachment[];
         let output = 'id;project_attachment_file_type;project_attachment_file_name;project_attachment_file;project_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.project_attachment_file_type + ';' + element.project_attachment_file_name + ';' + element.project_attachment_file + ';' + element.project_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_ProjectAttachments.csv');
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
            this.project_attachmentDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   downloadFile(file: string, type: string, name: string) {
      const byteCharacters = atob(file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
         byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: type});
      saveAs(blob, name);
   }

   saveDialogResult() {
      if (typeof this.project_attachmentSelected.id === 'undefined') {
         this.project_attachmentDataService.post(this.project_attachmentSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getProjectAttachments();
         }).catch( e => console.log(e) );
      } else {
         this.project_attachmentDataService.put(this.project_attachmentSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getProjectAttachments();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}