import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { TaskAttachmentService } from './../../../../services/CRUD/BUILDBOARD/taskattachment.service';
import { TaskAttachment } from './../../../../models/BUILDBOARD/TaskAttachment';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { Task } from './../../../../models/BUILDBOARD/Task';


@Component({
   selector: 'app-taskattachment',
   templateUrl: './taskattachment.component.html',
   styleUrls: ['./taskattachment.component.scss']
})
export class TaskAttachmentComponent implements OnInit {
   task_attachments: TaskAttachment[] = [];
   task_attachmentSelected: TaskAttachment = new TaskAttachment();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   tasks: Task[] = [];
   constructor(
               private toastr: ToastrManager,
               private taskDataService: TaskService,
               private task_attachmentDataService: TaskAttachmentService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getTask();
   }

   CodeFileTaskAttachment(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            this.task_attachmentSelected.task_attachment_file_name = file.name;
            this.task_attachmentSelected.task_attachment_file_type = file.type;
            this.task_attachmentSelected.task_attachment_file = reader.result.toString().split(',')[1];
         };
      }
   }

   selectTaskAttachment(task_attachment: TaskAttachment) {
      this.task_attachmentSelected = task_attachment;
   }

   getTask() {
      this.tasks = [];
      this.taskDataService.get().then( r => {
         this.tasks = r as Task[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getTaskAttachments();
   }

   getTaskAttachments() {
      this.task_attachments = [];
      this.task_attachmentSelected = new TaskAttachment();
      this.task_attachmentSelected.task_id = 0;
      this.task_attachmentDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.task_attachments = r.data as TaskAttachment[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newTaskAttachment() {
      this.task_attachmentSelected = new TaskAttachment();
      this.task_attachmentSelected.task_id = 0;
      this.showDialog = true;
   }

   editTaskAttachment() {
      if (typeof this.task_attachmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteTaskAttachment() {
      if (typeof this.task_attachmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.task_attachmentDataService.delete(this.task_attachmentSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getTaskAttachments();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.task_attachmentDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_TaskAttachments.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.task_attachmentDataService.get().then( r => {
         const backupData = r as TaskAttachment[];
         let output = 'id;task_attachment_file_type;task_attachment_file_name;task_attachment_file;task_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.task_attachment_file_type + ';' + element.task_attachment_file_name + ';' + element.task_attachment_file + ';' + element.task_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_TaskAttachments.csv');
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
            this.task_attachmentDataService.masiveLoad(newData).then( r => {
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
      if (typeof this.task_attachmentSelected.id === 'undefined') {
         this.task_attachmentDataService.post(this.task_attachmentSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getTaskAttachments();
         }).catch( e => console.log(e) );
      } else {
         this.task_attachmentDataService.put(this.task_attachmentSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getTaskAttachments();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}