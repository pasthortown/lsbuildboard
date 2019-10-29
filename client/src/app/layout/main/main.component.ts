import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/models/BUILDBOARD/State';
import { TaskService } from 'src/app/services/CRUD/BUILDBOARD/task.service';
import { Task } from 'src/app/models/BUILDBOARD/Task';
import { TaskState } from 'src/app/models/BUILDBOARD/TaskState';
import { TaskStateService } from 'src/app/services/CRUD/BUILDBOARD/taskstate.service';
import { TaskAttachment } from 'src/app/models/BUILDBOARD/TaskAttachment';
import { saveAs } from 'file-saver/FileSaver';
import { TaskAttachmentService } from 'src/app/services/CRUD/BUILDBOARD/taskattachment.service';
import { Project } from 'src/app/models/BUILDBOARD/Project';
import { ProjectService } from 'src/app/services/CRUD/BUILDBOARD/project.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    task_groups: any[] = [];
    projects: Project[] = [];
    user: any;
    project_id = 0;

    constructor(
        private taskDataService: TaskService,
        private taskAttachmentDataService: TaskAttachmentService,
        private taskStateDataService: TaskStateService,
        private projectDataService: ProjectService,
    ) {}

    ngOnInit() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.getProject();
    }

    getProject() {
        this.projects = [];
        this.projectDataService.get().then( r => {
           this.projects = r as Project[];
        }).catch( e => console.log(e) );
    }

    getTaskGroups() {
        this.task_groups = [];
        if (this.project_id == 0) {
            return;
        }
        this.taskDataService.get_task_groups(this.user.id, this.project_id).then( r => {
           this.task_groups = r as any[];
           this.task_groups.forEach(task_group => {
               task_group.tasks.forEach(task => {
                   task.moving = false;
               });
           });
        }).catch( e => console.log(e) );
    }

    move(side: string, task_moving: Task) {
        if (task_moving.moving) {
            task_moving.moving = false;
            task_moving.side_moving = '';
        } else {
            task_moving.moving = true;
            task_moving.side_moving = side;
        }
    }

    commit(event, moving_task, comment) {
        if (event.keyCode == 13) {
            const task_state = new TaskState();
            if (moving_task.side_moving == 'right') {
                task_state.state_id = moving_task.state_id + 1;
            } else {
                task_state.state_id = moving_task.state_id - 1;
            }
            task_state.date_time = new Date();
            task_state.task_id = moving_task.id;
            task_state.user_id = this.user.id;
            task_state.comment = comment;
            this.taskStateDataService.post(task_state).then( r => {
                this.getTaskGroups();
            }).catch( e => { console.log(e); });
        }
    }

    downloadAttachment(attachment) {
        this.downloadFile(attachment.task_attachment_file,
           attachment.task_attachment_file_type,
           attachment.task_attachment_file_name);
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
    
    deleteAttachment(attachment, task) {
        this.taskAttachmentDataService.delete(attachment.id).then( r => {
            this.getAttachment(task);
        }).catch( e => {console.log(e);} );
    }

    getAttachment(task: Task) {
        task.attachment = [];
        this.taskDataService.get(task.id).then(r => {
            task.attachment = r.attach as TaskAttachment[];
        }).catch(e => {console.log(e);});
    }

    CodeFileTaskAttachment(event, task: Task) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
           const file = event.target.files[0];
           reader.readAsDataURL(file);
           reader.onload = () => {
              let attachment = new TaskAttachment();
              attachment.task_attachment_file_name = file.name;
              attachment.task_attachment_file_type = file.type;
              attachment.task_attachment_file = reader.result.toString().split(',')[1];
              attachment.task_id = task.id;
              this.taskAttachmentDataService.post(attachment).then( r => {
                  this.getAttachment(task);
              }).catch(e => { console.log(e); });
           };
        }
    }
}
