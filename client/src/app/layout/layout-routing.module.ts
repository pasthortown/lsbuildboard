import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
   {
      path: '',
      component: LayoutComponent,
      children: [
         {
            path: '',
            redirectTo: 'main'
         },
         {
            path: 'main',
            loadChildren: './main/main.module#MainModule'
         },
         {
            path: 'dashboard_project_manager',
            loadChildren: './dashboard-project-manager/dashboard-project-manager.module#DashboardProjectManagerModule'
         },
         {
            path: 'profile',
            loadChildren: './profile/profile.module#ProfileModule'
         },

         //BUILDBOARD

         {
            path: 'history',
            loadChildren: './CRUD/BUILDBOARD/History/history.module#HistoryModule'
         },
         {
            path: 'history_attachment',
            loadChildren: './CRUD/BUILDBOARD/HistoryAttachment/historyattachment.module#HistoryAttachmentModule'
         },
         {
            path: 'task',
            loadChildren: './CRUD/BUILDBOARD/Task/task.module#TaskModule'
         },
         {
            path: 'task_attachment',
            loadChildren: './CRUD/BUILDBOARD/TaskAttachment/taskattachment.module#TaskAttachmentModule'
         },
         {
            path: 'task_state',
            loadChildren: './CRUD/BUILDBOARD/TaskState/taskstate.module#TaskStateModule'
         },
         {
            path: 'state',
            loadChildren: './CRUD/BUILDBOARD/State/state.module#StateModule'
         },
         {
            path: 'work_time',
            loadChildren: './CRUD/BUILDBOARD/WorkTime/worktime.module#WorkTimeModule'
         },
         {
            path: 'priority',
            loadChildren: './CRUD/BUILDBOARD/Priority/priority.module#PriorityModule'
         },
         {
            path: 'project',
            loadChildren: './CRUD/BUILDBOARD/Project/project.module#ProjectModule'
         },
         {
            path: 'project_attachment',
            loadChildren: './CRUD/BUILDBOARD/ProjectAttachment/projectattachment.module#ProjectAttachmentModule'
         },
         {
            path: 'project_comment',
            loadChildren: './CRUD/BUILDBOARD/ProjectComment/projectcomment.module#ProjectCommentModule'
         },
         {
            path: 'role',
            loadChildren: './CRUD/BUILDBOARD/Role/role.module#RoleModule'
         },
         {
            path: 'role_assigment',
            loadChildren: './CRUD/BUILDBOARD/RoleAssigment/roleassigment.module#RoleAssigmentModule'
         },
         {
            path: 'blank',
            loadChildren: './blank-page/blank-page.module#BlankPageModule'
         },
         {
            path: 'not-found',
            loadChildren: './not-found/not-found.module#NotFoundModule'
         },
         {
            path: '**',
            redirectTo: 'not-found'
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class LayoutRoutingModule {}