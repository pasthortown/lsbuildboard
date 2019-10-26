export class History {
   id: number;
   description: String;
   source: String;
   dod_date_time: Date;
   dor_date_time: Date;
   state_id: number;
   user_id: number;
   priority_id: number;
   project_id: number;
   constructor() {
      this.id = 0;
      this.description = '';
      this.source = '';
      this.dod_date_time = new Date();
      this.dor_date_time = new Date();
      this.state_id = 0;
      this.user_id = 0;
      this.priority_id = 0;
      this.priority_id = 0;
   }
}