import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { RoleService } from './../../../../services/CRUD/BUILDBOARD/role.service';
import { Role } from './../../../../models/BUILDBOARD/Role';

@Component({
   selector: 'app-role',
   templateUrl: './role.component.html',
   styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
   roles: Role[] = [];
   roleSelected: Role = new Role();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private toastr: ToastrManager,
               private roleDataService: RoleService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectRole(role: Role) {
      this.roleSelected = role;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getRoles();
   }

   getRoles() {
      this.roles = [];
      this.roleSelected = new Role();
      this.roleDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.roles = r.data as Role[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newRole() {
      this.roleSelected = new Role();
      this.showDialog = true;
   }

   editRole() {
      if (typeof this.roleSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteRole() {
      if (typeof this.roleSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.roleDataService.delete(this.roleSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getRoles();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.roleDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Roles.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.roleDataService.get().then( r => {
         const backupData = r as Role[];
         let output = 'id;name;description\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.name + ';' + element.description + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Roles.csv');
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
            this.roleDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      if (typeof this.roleSelected.id === 'undefined') {
         this.roleDataService.post(this.roleSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getRoles();
            this.showDialog = false;
         }).catch( e => console.log(e) );
      } else {
         this.roleDataService.put(this.roleSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getRoles();
            this.showDialog = false;
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;
      this.goToPage(this.currentPage);
   }
}