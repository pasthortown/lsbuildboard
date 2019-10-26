import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { WorkTimeService } from './../../../../services/CRUD/BUILDBOARD/worktime.service';
import { WorkTime } from './../../../../models/BUILDBOARD/WorkTime';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { Task } from './../../../../models/BUILDBOARD/Task';

import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';


@Component({
   selector: 'app-worktime',
   templateUrl: './worktime.component.html',
   styleUrls: ['./worktime.component.scss']
})
export class WorkTimeComponent implements OnInit {
   work_times: WorkTime[] = [];
   work_timeSelected: WorkTime = new WorkTime();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   tasks: Task[] = [];
   users: User[] = [];
   constructor(
               private toastr: ToastrManager,
               private taskDataService: TaskService,
               private userDataService: UserService,
               private work_timeDataService: WorkTimeService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getTask();
      this.getUser();
   }

   selectWorkTime(work_time: WorkTime) {
      this.work_timeSelected = work_time;
   }

   getTask() {
      this.tasks = [];
      this.taskDataService.get().then( r => {
         this.tasks = r as Task[];
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
      this.getWorkTimes();
   }

   getWorkTimes() {
      this.work_times = [];
      this.work_timeSelected = new WorkTime();
      this.work_timeSelected.task_id = 0;
      this.work_timeSelected.user_id = 0;
      this.work_timeDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.work_times = r.data as WorkTime[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newWorkTime() {
      this.work_timeSelected = new WorkTime();
      this.work_timeSelected.task_id = 0;
      this.work_timeSelected.user_id = 0;
      this.showDialog = true;
   }

   editWorkTime() {
      if (typeof this.work_timeSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteWorkTime() {
      if (typeof this.work_timeSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.work_timeDataService.delete(this.work_timeSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getWorkTimes();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.work_timeDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_WorkTimes.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.work_timeDataService.get().then( r => {
         const backupData = r as WorkTime[];
         let output = 'id;start;end;task_id;user_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.start + ';' + element.end + ';' + element.task_id + ';' + element.user_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_WorkTimes.csv');
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
            this.work_timeDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      if (typeof this.work_timeSelected.id === 'undefined') {
         this.work_timeDataService.post(this.work_timeSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getWorkTimes();
         }).catch( e => console.log(e) );
      } else {
         this.work_timeDataService.put(this.work_timeSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getWorkTimes();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}