import { TaskAttachment } from './TaskAttachment';

export class Task {
   id: number;
   title: String;
   description: String;
   time_expected: any;
   moving: Boolean;
   side_moving: String;
   history_id: number;
   user_id: number;
   attachment: TaskAttachment[];
   priority_id: number;
   constructor() {
      this.id = 0;
      this.attachment = [];
      this.moving = false;
      this.side_moving = '';
      this.title = '';
      this.description = '';
      this.history_id = 0;
      this.user_id = 0;
      this.priority_id = 0;
   }
}