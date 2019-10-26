import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { HistoryAttachmentService } from './../../../../services/CRUD/BUILDBOARD/historyattachment.service';
import { HistoryAttachment } from './../../../../models/BUILDBOARD/HistoryAttachment';
import { HistoryService } from './../../../../services/CRUD/BUILDBOARD/history.service';
import { History } from './../../../../models/BUILDBOARD/History';


@Component({
   selector: 'app-historyattachment',
   templateUrl: './historyattachment.component.html',
   styleUrls: ['./historyattachment.component.scss']
})
export class HistoryAttachmentComponent implements OnInit {
   history_attachments: HistoryAttachment[] = [];
   history_attachmentSelected: HistoryAttachment = new HistoryAttachment();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   histories: History[] = [];
   constructor(
               private toastr: ToastrManager,
               private historyDataService: HistoryService,
               private history_attachmentDataService: HistoryAttachmentService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getHistory();
   }

   CodeFileHistoryAttachment(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            this.history_attachmentSelected.history_attachment_file_name = file.name;
            this.history_attachmentSelected.history_attachment_file_type = file.type;
            this.history_attachmentSelected.history_attachment_file = reader.result.toString().split(',')[1];
         };
      }
   }

   selectHistoryAttachment(history_attachment: HistoryAttachment) {
      this.history_attachmentSelected = history_attachment;
   }

   getHistory() {
      this.histories = [];
      this.historyDataService.get().then( r => {
         this.histories = r as History[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getHistoryAttachments();
   }

   getHistoryAttachments() {
      this.history_attachments = [];
      this.history_attachmentSelected = new HistoryAttachment();
      this.history_attachmentSelected.history_id = 0;
      this.history_attachmentDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.history_attachments = r.data as HistoryAttachment[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newHistoryAttachment() {
      this.history_attachmentSelected = new HistoryAttachment();
      this.history_attachmentSelected.history_id = 0;
      this.showDialog = true;
   }

   editHistoryAttachment() {
      if (typeof this.history_attachmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deleteHistoryAttachment() {
      if (typeof this.history_attachmentSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.history_attachmentDataService.delete(this.history_attachmentSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getHistoryAttachments();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.history_attachmentDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_HistoryAttachments.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.history_attachmentDataService.get().then( r => {
         const backupData = r as HistoryAttachment[];
         let output = 'id;history_attachment_file_type;history_attachment_file_name;history_attachment_file;history_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.history_attachment_file_type + ';' + element.history_attachment_file_name + ';' + element.history_attachment_file + ';' + element.history_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_HistoryAttachments.csv');
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
            this.history_attachmentDataService.masiveLoad(newData).then( r => {
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
      if (typeof this.history_attachmentSelected.id === 'undefined') {
         this.history_attachmentDataService.post(this.history_attachmentSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            this.getHistoryAttachments();
         }).catch( e => console.log(e) );
      } else {
         this.history_attachmentDataService.put(this.history_attachmentSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            this.getHistoryAttachments();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;      this.goToPage(this.currentPage);
   }
}