import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { PriorityService } from './../../../../services/CRUD/BUILDBOARD/priority.service';
import { Priority } from './../../../../models/BUILDBOARD/Priority';

@Component({
   selector: 'app-priority',
   templateUrl: './priority.component.html',
   styleUrls: ['./priority.component.scss']
})
export class PriorityComponent implements OnInit {
   priorities: Priority[] = [];
   prioritySelected: Priority = new Priority();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private toastr: ToastrManager,
               private priorityDataService: PriorityService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectPriority(priority: Priority) {
      this.prioritySelected = priority;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getPriorities();
   }

   getPriorities() {
      this.priorities = [];
      this.prioritySelected = new Priority();
      this.priorityDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.priorities = r.data as Priority[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newPriority() {
      this.prioritySelected = new Priority();
      this.showDialog = true;
   }

   editPriority() {
      if (typeof this.prioritySelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deletePriority() {
      if (typeof this.prioritySelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.priorityDataService.delete(this.prioritySelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getPriorities();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.priorityDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Priorities.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.priorityDataService.get().then( r => {
         const backupData = r as Priority[];
         let output = 'id;description\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.description + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Priorities.csv');
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
            this.priorityDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      if (typeof this.prioritySelected.id === 'undefined') {
         this.priorityDataService.post(this.prioritySelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getPriorities();
            this.showDialog = false;
         }).catch( e => console.log(e) );
      } else {
         this.priorityDataService.put(this.prioritySelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getPriorities();
            this.showDialog = false;
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}