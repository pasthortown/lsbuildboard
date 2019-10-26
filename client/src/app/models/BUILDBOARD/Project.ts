export class Project {
   id: number;
   name: String;
   description: String;
   start_date: Date;
   dod_date: Date;
   dor_date: Date;
   constructor() {
      this.id = 0;
      this.name = '';
      this.description = '';
      this.start_date = new Date();
      this.dod_date = new Date();
      this.dor_date = new Date();
   }
}