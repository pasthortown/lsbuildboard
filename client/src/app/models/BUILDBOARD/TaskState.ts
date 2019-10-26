export class TaskState {
   id: number;
   date_time: Date;
   comment: String;
   task_id: number;
   state_id: number;
   user_id: number;
   constructor() {
      this.date_time = new Date();
      this.comment = '';
      this.task_id = 0;
      this.state_id = 0;
      this.user_id = 0;
   }
}