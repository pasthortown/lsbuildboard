import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { Project } from './../../../../models/BUILDBOARD/Project';
import { ProjectAttachment } from 'src/app/models/BUILDBOARD/ProjectAttachment';
import { ProjectAttachmentService } from 'src/app/services/CRUD/BUILDBOARD/projectattachment.service';

@Component({
   selector: 'app-project',
   templateUrl: './project.component.html',
   styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
   projects: Project[] = [];
   projectSelected: Project = new Project();
   attachments: ProjectAttachment[] = [];
   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private toastr: ToastrManager,
               private projectDataService: ProjectService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectProject(project: Project) {
      this.showDialog = false;
      this.projectSelected = project;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.showDialog = false;
      this.currentPage = page;
      this.getProjects();
   }

   getProjects() {
      this.projects = [];
      this.projectSelected = new Project();
      this.projectDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.projects = r.data as Project[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newProject() {
      this.projectSelected = new Project();
      this.projectSelected.dod_date = new Date();
      this.projectSelected.dor_date = new Date();
      this.showDialog = true;
      this.attachments = [];
   }

   editProject() {
      if (typeof this.projectSelected.id === 'undefined' || this.projectSelected.id === 0) {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
      this.getAttachments();
   }

   getAttachments() {
      this.attachments = [];
      this.projectDataService.get(this.projectSelected.id).then( r => {
         this.attachments = r.attach as ProjectAttachment[];
      }).catch( e => { console.log(e); });
   }

   deleteProject() {
      if (typeof this.projectSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.projectDataService.delete(this.projectSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.showDialog = false;
         this.goToPage(1);
      }).catch( e => console.log(e) );
   }

   backup() {
      this.projectDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Projects.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.projectDataService.get().then( r => {
         const backupData = r as Project[];
         let output = 'id;name;description;start_date;dod_date;dor_date\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.name + ';' + element.description + ';' + element.start_date + ';' + element.dod_date + ';' + element.dor_date + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Projects.csv');
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
            this.projectDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      const data = {project: this.projectSelected, attachments: this.attachments};
      this.projectDataService.save(data).then( r => {
         this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
         this.getProjects();
         this.showDialog = false;
      }).catch( e => console.log(e) );
   }

   cancelDialogResult() {
      this.showDialog = false;
      this.goToPage(this.currentPage);
   }

   CodeFileProjectAttachment(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            let attachment = new ProjectAttachment();
            attachment.project_attachment_file_name = file.name;
            attachment.project_attachment_file_type = file.type;
            attachment.project_attachment_file = reader.result.toString().split(',')[1];
            this.attachments.push(attachment);
         };
      }
   }

   setDateTimeDOD(event) {
      this.projectSelected.dod_date = new Date(event.detail.value);
   }

   setDateTimeDOR(event) {
      this.projectSelected.dor_date = new Date(event.detail.value);
   }

   setDateTimeStart(event) {
      this.projectSelected.start_date = new Date(event.detail.value);
   }

   deleteAttachment(attachment) {
      const newAttachments = [];
      this.attachments.forEach(attachmentInMemmory => {
         if (attachment !== attachmentInMemmory) {
            newAttachments.push(attachmentInMemmory);
         }
      });
      this.attachments = newAttachments;
   }

   downloadAttachment(attachment) {
      this.downloadFile(attachment.project_attachment_file,
         attachment.project_attachment_file_type,
         attachment.project_attachment_file_name);
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
}