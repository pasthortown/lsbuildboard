import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { RoleAssigmentService } from './../../../../services/CRUD/BUILDBOARD/roleassigment.service';
import { RoleAssigment } from './../../../../models/BUILDBOARD/RoleAssigment';
import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';

import { RoleService } from './../../../../services/CRUD/BUILDBOARD/role.service';
import { Role } from './../../../../models/BUILDBOARD/Role';


@Component({
   selector: 'app-roleassigment',
   templateUrl: './roleassigment.component.html',
   styleUrls: ['./roleassigment.component.scss']
})
export class RoleAssigmentComponent implements OnInit {
   role_assigments: RoleAssigment[] = [];
   role_assigmentSelected: RoleAssigment = new RoleAssigment();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   users: User[] = [];
   roles: Role[] = [];
   constructor(
               private toastr: ToastrManager,
               private userDataService: UserService,
               private roleDataService: RoleService,
               private role_assigmentDataService: RoleAssigmentService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getUser();
      this.getRole();
   }

   selectRoleAssigment(role_assigment: RoleAssigment) {
      this.role_assigmentSelected = role_assigment;
   }

   getUser() {
      this.users = [];
      this.userDataService.get().then( r => {
         this.users = r as User[];
      }).catch( e => console.log(e) );
   }

   getRole() {
      this.roles = [];
      this.roleDataService.get().then( r => {
         this.roles = r as Role[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getRoleAssigments();
   }

   getRoleAssigments() {
      this.role_assigments = [];
      this.role_assigmentSelected = new RoleAssigment();
      this.role_assigmentSelected.user_id = 0;
      this.role_assigmentSelected.role_id = 0;
      this.role_assigmentDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.role_assigments = r.data as RoleAssigment[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newRoleAssigment() {
      this.role_assigmentSelected = new RoleAssigment();
      this.role_assigmentSelected.user_id = 0;
      this.role_assigmentSelected.role_id = 0;
      this.showDialog = true;
   }

   editRoleAssigment() {
      if (typeof this.role_assigmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteRoleAssigment() {
      if (typeof this.role_assigmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.role_assigmentDataService.delete(this.role_assigmentSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getRoleAssigments();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.role_assigmentDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_RoleAssigments.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.role_assigmentDataService.get().then( r => {
         const backupData = r as RoleAssigment[];
         let output = 'id;user_id;role_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.user_id + ';' + element.role_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_RoleAssigments.csv');
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
            this.role_assigmentDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   saveDialogResult() {
      if (typeof this.role_assigmentSelected.id === 'undefined') {
         this.role_assigmentDataService.post(this.role_assigmentSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getRoleAssigments();
         }).catch( e => console.log(e) );
      } else {
         this.role_assigmentDataService.put(this.role_assigmentSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getRoleAssigments();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}