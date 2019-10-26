import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { Task } from './../../../../models/BUILDBOARD/Task';
import { HistoryService } from './../../../../services/CRUD/BUILDBOARD/history.service';
import { History } from './../../../../models/BUILDBOARD/History';

import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';

import { PriorityService } from './../../../../services/CRUD/BUILDBOARD/priority.service';
import { Priority } from './../../../../models/BUILDBOARD/Priority';
import { Project } from 'src/app/models/BUILDBOARD/Project';
import { ProjectService } from 'src/app/services/CRUD/BUILDBOARD/project.service';
import { TaskAttachment } from 'src/app/models/BUILDBOARD/TaskAttachment';


@Component({
   selector: 'app-task',
   templateUrl: './task.component.html',
   styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
   project_id = 0;
   history_id = 0;

   projects: Project[] = [];
   tasks: Task[] = [];
   taskSelected: Task = new Task();
   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   histories: History[] = [];
   users: User[] = [];
   priorities: Priority[] = [];
   attachments: TaskAttachment[] = [];
   task_attachmentSelected = new TaskAttachment();
   constructor(
               private toastr: ToastrManager,
               private historyDataService: HistoryService,
               private userDataService: UserService,
               private projectDataService: ProjectService,
               private priorityDataService: PriorityService,
               private taskDataService: TaskService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getProject();
      this.getUser();
      this.getPriority();
   }

   getProject() {
      this.projects = [];
      this.showDialog = false;
      this.projectDataService.get().then( r => {
         this.projects = r as Project[];
      }).catch( e => console.log(e) );
   }

   selectTask(task: Task) {
      this.showDialog = false;
      this.taskSelected = task;
   }

   getHistory(project_id: number) {
      this.histories = [];
      this.history_id = 0;
      this.showDialog = false;
      this.historyDataService.get_by_project_id(project_id).then( r => {
         this.histories = r as History[];
      }).catch( e => console.log(e) );
   }

   getUser() {
      this.users = [];
      this.userDataService.get().then( r => {
         this.users = r as User[];
      }).catch( e => console.log(e) );
   }

   getPriority() {
      this.priorities = [];
      this.priorityDataService.get().then( r => {
         this.priorities = r as Priority[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getTasks(this.history_id);
   }

   getTasks(history_id: number) {
      this.tasks = [];
      this.showDialog = false;
      this.taskSelected = new Task();
      this.taskDataService.get_paginate(this.recordsByPage, this.currentPage, this.history_id).then( r => {
         this.tasks = r.data as Task[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newTask() {
      this.taskSelected = new Task();
      this.attachments = [];
      this.showDialog = true;
   }

   editTask() {
      if (typeof this.taskSelected.id === 'undefined' || this.taskSelected.id === 0) {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
      this.getAttachments();
   }

   getAttachments() {
      this.attachments = [];
      this.taskDataService.get(this.taskSelected.id).then( r => {
         this.attachments = r.attach as TaskAttachment[];
      }).catch( e => { console.log(e); });
   }

   deleteTask() {
      if (typeof this.taskSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.taskDataService.delete(this.taskSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getTasks(this.history_id);
         this.showDialog = false;
      }).catch( e => console.log(e) );
   }

   backup() {
      this.taskDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Tasks.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.taskDataService.get().then( r => {
         const backupData = r as Task[];
         let output = 'id;title;description;time_expected;history_id;user_id;priority_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.title + ';' + element.description + ';' + element.time_expected + ';' + element.history_id + ';' + element.user_id + ';' + element.priority_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Tasks.csv');
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
            this.taskDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   CodeFileTaskAttachment(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            let attachment = new TaskAttachment();
            attachment.task_attachment_file_name = file.name;
            attachment.task_attachment_file_type = file.type;
            attachment.task_attachment_file = reader.result.toString().split(',')[1];
            this.attachments.push(attachment);
         };
      }
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
      this.downloadFile(attachment.task_attachment_file,
         attachment.task_attachment_file_type,
         attachment.task_attachment_file_name);
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

   setDateTime(event) {
      this.taskSelected.time_expected = event.detail.elementVal;
   }

   saveDialogResult() {
      this.taskSelected.history_id = this.history_id;
      const data = {task: this.taskSelected, attachments: this.attachments};
      this.taskDataService.save(data).then( r => {
         this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
         this.getTasks(this.history_id);
         this.showDialog = false;
      }).catch( e => console.log(e) );
   }

   cancelDialogResult() {
      this.showDialog = false;
      this.goToPage(this.currentPage);
   }
}