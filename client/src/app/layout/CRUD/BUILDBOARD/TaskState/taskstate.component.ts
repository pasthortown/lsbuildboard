import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { TaskStateService } from './../../../../services/CRUD/BUILDBOARD/taskstate.service';
import { TaskState } from './../../../../models/BUILDBOARD/TaskState';
import { TaskService } from './../../../../services/CRUD/BUILDBOARD/task.service';
import { Task } from './../../../../models/BUILDBOARD/Task';

import { StateService } from './../../../../services/CRUD/BUILDBOARD/state.service';
import { State } from './../../../../models/BUILDBOARD/State';

import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';


@Component({
   selector: 'app-taskstate',
   templateUrl: './taskstate.component.html',
   styleUrls: ['./taskstate.component.scss']
})
export class TaskStateComponent implements OnInit {
   task_states: TaskState[] = [];
   task_stateSelected: TaskState = new TaskState();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   tasks: Task[] = [];
   states: State[] = [];
   users: User[] = [];
   constructor(
               private toastr: ToastrManager,
               private taskDataService: TaskService,
               private stateDataService: StateService,
               private userDataService: UserService,
               private task_stateDataService: TaskStateService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getTask();
      this.getState();
      this.getUser();
   }

   selectTaskState(task_state: TaskState) {
      this.task_stateSelected = task_state;
   }

   getTask() {
      this.tasks = [];
      this.taskDataService.get().then( r => {
         this.tasks = r as Task[];
      }).catch( e => console.log(e) );
   }

   getState() {
      this.states = [];
      this.stateDataService.get().then( r => {
         this.states = r as State[];
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
      this.getTaskStates();
   }

   getTaskStates() {
      this.task_states = [];
      this.task_stateSelected = new TaskState();
      this.task_stateSelected.task_id = 0;
      this.task_stateSelected.state_id = 0;
      this.task_stateSelected.user_id = 0;
      this.task_stateDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.task_states = r.data as TaskState[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newTaskState() {
      this.task_stateSelected = new TaskState();
      this.task_stateSelected.task_id = 0;
      this.task_stateSelected.state_id = 0;
      this.task_stateSelected.user_id = 0;
      this.showDialog = true;
   }

   editTaskState() {
      if (typeof this.task_stateSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteTaskState() {
      if (typeof this.task_stateSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.task_stateDataService.delete(this.task_stateSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getTaskStates();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.task_stateDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_TaskStates.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.task_stateDataService.get().then( r => {
         const backupData = r as TaskState[];
         let output = 'id;date_time;comment;task_id;state_id;user_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.date_time + ';' + element.comment + ';' + element.task_id + ';' + element.state_id + ';' + element.user_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_TaskStates.csv');
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
            this.task_stateDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      this.task_stateSelected.date_time = new Date();
      if (typeof this.task_stateSelected.id === 'undefined') {
         this.task_stateDataService.post(this.task_stateSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getTaskStates();
            this.showDialog = false;
            this.goToPage(this.currentPage);
         }).catch( e => console.log(e) );
      } else {
         this.task_stateDataService.put(this.task_stateSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getTaskStates();
            this.showDialog = false;
            this.goToPage(this.currentPage);
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;
      this.goToPage(this.currentPage);
   }
}