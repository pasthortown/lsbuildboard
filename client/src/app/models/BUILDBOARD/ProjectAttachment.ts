export class ProjectAttachment {
   id: number;
   project_attachment_file_type: string;
   project_attachment_file_name: string;
   project_attachment_file: string;
   project_id: number;
   constructor() {
      this.project_attachment_file = '';
      this.project_attachment_file_name = '';
      this.project_attachment_file_type = '';
   }
}