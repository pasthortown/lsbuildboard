import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { HistoryService } from './../../../../services/CRUD/BUILDBOARD/history.service';
import { History } from './../../../../models/BUILDBOARD/History';
import { StateService } from './../../../../services/CRUD/BUILDBOARD/state.service';
import { State } from './../../../../models/BUILDBOARD/State';

import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';

import { PriorityService } from './../../../../services/CRUD/BUILDBOARD/priority.service';
import { Priority } from './../../../../models/BUILDBOARD/Priority';

import { ProjectService } from './../../../../services/CRUD/BUILDBOARD/project.service';
import { Project } from './../../../../models/BUILDBOARD/Project';
import { HistoryAttachment } from 'src/app/models/BUILDBOARD/HistoryAttachment';


@Component({
   selector: 'app-history',
   templateUrl: './history.component.html',
   styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
   histories: History[] = [];
   historySelected: History = new History();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   history_states: State[] = [];
   users: User[] = [];
   priorities: Priority[] = [];
   projects: Project[] = [];
   project_id = 0;
   attachments: HistoryAttachment[] = [];
   constructor(
               private toastr: ToastrManager,
               private history_stateDataService: StateService,
               private userDataService: UserService,
               private priorityDataService: PriorityService,
               private projectDataService: ProjectService,
               private historyDataService: HistoryService) {}

   ngOnInit() {
      this.getState();
      this.getUser();
      this.getPriority();
      this.getProject();
   }

   selectHistory(history: History) {
      this.showDialog = false;
      this.historySelected = history;
   }

   getState() {
      this.history_states = [];
      this.history_stateDataService.get().then( r => {
         this.history_states = r as State[];
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

   getProject() {
      this.projects = [];
      this.showDialog = false;
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
      this.getHistories(this.project_id);
      this.showDialog = false;
   }

   setDateTimeDOD(event) {
      this.historySelected.dod_date_time = new Date(event.detail.value);
   }

   setDateTimeDOR(event) {
      this.historySelected.dor_date_time = new Date(event.detail.value);
   }
   
   getHistories(project_id: number) {
      this.histories = [];
      this.historySelected = new History();
      this.showDialog = false;
      this.historyDataService.get_paginate(this.recordsByPage, this.currentPage, this.project_id).then( r => {
         this.histories = r.data as History[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newHistory() {
      this.historySelected = new History();
      this.historySelected.project_id = this.project_id;
      this.showDialog = true;
      this.attachments = [];
   }

   editHistory() {
      if (typeof this.historySelected.id === 'undefined' || this.historySelected.id === 0) {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
      this.getAttachments();
   }

   getAttachments() {
      this.attachments = [];
      this.historyDataService.get(this.historySelected.id).then( r => {
         this.attachments = r.attach as HistoryAttachment[];
      }).catch( e => { console.log(e); });
   }

   deleteHistory() {
      if (typeof this.historySelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.historyDataService.delete(this.historySelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getHistories(this.project_id);
         this.showDialog = false;
      }).catch( e => console.log(e) );
   }

   backup() {
      this.historyDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Histories.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.historyDataService.get().then( r => {
         const backupData = r as History[];
         let output = 'id;description;source;dod_date_time;dor_date_time;state_id;user_id;priority_id;project_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.description + ';' + element.source + ';' + element.dod_date_time + ';' + element.dor_date_time + ';' + element.state_id + ';' + element.user_id + ';' + element.priority_id + ';' + element.project_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Histories.csv');
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
            this.historyDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   CodeFileHistoryAttachment(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            let attachment = new HistoryAttachment();
            attachment.history_attachment_file_name = file.name;
            attachment.history_attachment_file_type = file.type;
            attachment.history_attachment_file = reader.result.toString().split(',')[1];
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
      this.downloadFile(attachment.history_attachment_file,
         attachment.history_attachment_file_type,
         attachment.history_attachment_file_name);
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
      this.historySelected.project_id = this.project_id;
      const data = {history: this.historySelected, attachments: this.attachments};
      this.historyDataService.save(data).then( r => {
         this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
         this.getHistories(this.project_id);
         this.showDialog = false;
      }).catch( e => console.log(e) );
   }

   cancelDialogResult() {
      this.showDialog = false;
      this.goToPage(this.currentPage);
   }
}