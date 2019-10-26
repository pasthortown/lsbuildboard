<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
   return 'Web Wervice Realizado con LSCodeGenerator';
});

$router->group(['middleware' => []], function () use ($router) {
   $router->post('/login', ['uses' => 'AuthController@login']);
   $router->post('/register', ['uses' => 'AuthController@register']);
   $router->post('/password_recovery_request', ['uses' => 'AuthController@passwordRecoveryRequest']);
   $router->get('/password_recovery', ['uses' => 'AuthController@passwordRecovery']);
});

$router->group(['middleware' => ['auth']], function () use ($router) {
   $router->post('/user/password_change', ['uses' => 'AuthController@passwordChange']);


   //BUILDBOARD

   //CRUD ProfilePicture
   $router->post('/profilepicture', ['uses' => 'ProfilePictureController@post']);
   $router->get('/profilepicture', ['uses' => 'ProfilePictureController@get']);
   $router->get('/profilepicture/paginate', ['uses' => 'ProfilePictureController@paginate']);
   $router->put('/profilepicture', ['uses' => 'ProfilePictureController@put']);
   $router->delete('/profilepicture', ['uses' => 'ProfilePictureController@delete']);

   //CRUD User
   $router->post('/user', ['uses' => 'UserController@post']);
   $router->get('/user', ['uses' => 'UserController@get']);
   $router->get('/user/paginate', ['uses' => 'UserController@paginate']);
   $router->put('/user', ['uses' => 'UserController@put']);
   $router->delete('/user', ['uses' => 'UserController@delete']);

   //CRUD History
   $router->post('/history', ['uses' => 'HistoryController@post']);
   $router->get('/history', ['uses' => 'HistoryController@get']);
   $router->get('/history/by_project_id', ['uses' => 'HistoryController@by_project_id']);
   $router->get('/history/paginate', ['uses' => 'HistoryController@paginate']);
   $router->get('/history/backup', ['uses' => 'HistoryController@backup']);
   $router->put('/history', ['uses' => 'HistoryController@put']);
   $router->delete('/history', ['uses' => 'HistoryController@delete']);
   $router->post('/history/masive_load', ['uses' => 'HistoryController@masiveLoad']);
   $router->post('/history/save', ['uses' => 'HistoryController@save']);

   //CRUD HistoryAttachment
   $router->post('/historyattachment', ['uses' => 'HistoryAttachmentController@post']);
   $router->get('/historyattachment', ['uses' => 'HistoryAttachmentController@get']);
   $router->get('/historyattachment/paginate', ['uses' => 'HistoryAttachmentController@paginate']);
   $router->get('/historyattachment/backup', ['uses' => 'HistoryAttachmentController@backup']);
   $router->put('/historyattachment', ['uses' => 'HistoryAttachmentController@put']);
   $router->delete('/historyattachment', ['uses' => 'HistoryAttachmentController@delete']);
   $router->post('/historyattachment/masive_load', ['uses' => 'HistoryAttachmentController@masiveLoad']);

   //CRUD Task
   $router->post('/task', ['uses' => 'TaskController@post']);
   $router->get('/task', ['uses' => 'TaskController@get']);
   $router->get('/task/paginate', ['uses' => 'TaskController@paginate']);
   $router->get('/task/backup', ['uses' => 'TaskController@backup']);
   $router->put('/task', ['uses' => 'TaskController@put']);
   $router->delete('/task', ['uses' => 'TaskController@delete']);
   $router->post('/task/masive_load', ['uses' => 'TaskController@masiveLoad']);
   $router->post('/task/save', ['uses' => 'TaskController@save']);
   $router->get('/task/groups', ['uses' => 'TaskController@groups']);
   
   //CRUD TaskAttachment
   $router->post('/taskattachment', ['uses' => 'TaskAttachmentController@post']);
   $router->get('/taskattachment', ['uses' => 'TaskAttachmentController@get']);
   $router->get('/taskattachment/paginate', ['uses' => 'TaskAttachmentController@paginate']);
   $router->get('/taskattachment/backup', ['uses' => 'TaskAttachmentController@backup']);
   $router->put('/taskattachment', ['uses' => 'TaskAttachmentController@put']);
   $router->delete('/taskattachment', ['uses' => 'TaskAttachmentController@delete']);
   $router->post('/taskattachment/masive_load', ['uses' => 'TaskAttachmentController@masiveLoad']);

   //CRUD TaskState
   $router->post('/taskstate', ['uses' => 'TaskStateController@post']);
   $router->get('/taskstate', ['uses' => 'TaskStateController@get']);
   $router->get('/taskstate/paginate', ['uses' => 'TaskStateController@paginate']);
   $router->get('/taskstate/backup', ['uses' => 'TaskStateController@backup']);
   $router->put('/taskstate', ['uses' => 'TaskStateController@put']);
   $router->delete('/taskstate', ['uses' => 'TaskStateController@delete']);
   $router->post('/taskstate/masive_load', ['uses' => 'TaskStateController@masiveLoad']);

   //CRUD State
   $router->post('/state', ['uses' => 'StateController@post']);
   $router->get('/state', ['uses' => 'StateController@get']);
   $router->get('/state/paginate', ['uses' => 'StateController@paginate']);
   $router->get('/state/backup', ['uses' => 'StateController@backup']);
   $router->put('/state', ['uses' => 'StateController@put']);
   $router->delete('/state', ['uses' => 'StateController@delete']);
   $router->post('/state/masive_load', ['uses' => 'StateController@masiveLoad']);

   //CRUD WorkTime
   $router->post('/worktime', ['uses' => 'WorkTimeController@post']);
   $router->get('/worktime', ['uses' => 'WorkTimeController@get']);
   $router->get('/worktime/paginate', ['uses' => 'WorkTimeController@paginate']);
   $router->get('/worktime/backup', ['uses' => 'WorkTimeController@backup']);
   $router->put('/worktime', ['uses' => 'WorkTimeController@put']);
   $router->delete('/worktime', ['uses' => 'WorkTimeController@delete']);
   $router->post('/worktime/masive_load', ['uses' => 'WorkTimeController@masiveLoad']);

   //CRUD Priority
   $router->post('/priority', ['uses' => 'PriorityController@post']);
   $router->get('/priority', ['uses' => 'PriorityController@get']);
   $router->get('/priority/paginate', ['uses' => 'PriorityController@paginate']);
   $router->get('/priority/backup', ['uses' => 'PriorityController@backup']);
   $router->put('/priority', ['uses' => 'PriorityController@put']);
   $router->delete('/priority', ['uses' => 'PriorityController@delete']);
   $router->post('/priority/masive_load', ['uses' => 'PriorityController@masiveLoad']);

   //CRUD Project
   $router->post('/project', ['uses' => 'ProjectController@post']);
   $router->get('/project', ['uses' => 'ProjectController@get']);
   $router->get('/project/paginate', ['uses' => 'ProjectController@paginate']);
   $router->get('/project/backup', ['uses' => 'ProjectController@backup']);
   $router->put('/project', ['uses' => 'ProjectController@put']);
   $router->delete('/project', ['uses' => 'ProjectController@delete']);
   $router->post('/project/masive_load', ['uses' => 'ProjectController@masiveLoad']);
   $router->post('/project/save', ['uses' => 'ProjectController@save']);

   //CRUD ProjectAttachment
   $router->post('/projectattachment', ['uses' => 'ProjectAttachmentController@post']);
   $router->get('/projectattachment', ['uses' => 'ProjectAttachmentController@get']);
   $router->get('/projectattachment/paginate', ['uses' => 'ProjectAttachmentController@paginate']);
   $router->get('/projectattachment/backup', ['uses' => 'ProjectAttachmentController@backup']);
   $router->put('/projectattachment', ['uses' => 'ProjectAttachmentController@put']);
   $router->delete('/projectattachment', ['uses' => 'ProjectAttachmentController@delete']);
   $router->post('/projectattachment/masive_load', ['uses' => 'ProjectAttachmentController@masiveLoad']);

   //CRUD ProjectComment
   $router->post('/projectcomment', ['uses' => 'ProjectCommentController@post']);
   $router->get('/projectcomment', ['uses' => 'ProjectCommentController@get']);
   $router->get('/projectcomment/paginate', ['uses' => 'ProjectCommentController@paginate']);
   $router->get('/projectcomment/backup', ['uses' => 'ProjectCommentController@backup']);
   $router->put('/projectcomment', ['uses' => 'ProjectCommentController@put']);
   $router->delete('/projectcomment', ['uses' => 'ProjectCommentController@delete']);
   $router->post('/projectcomment/masive_load', ['uses' => 'ProjectCommentController@masiveLoad']);

   //CRUD Role
   $router->post('/role', ['uses' => 'RoleController@post']);
   $router->get('/role', ['uses' => 'RoleController@get']);
   $router->get('/role/paginate', ['uses' => 'RoleController@paginate']);
   $router->get('/role/backup', ['uses' => 'RoleController@backup']);
   $router->put('/role', ['uses' => 'RoleController@put']);
   $router->delete('/role', ['uses' => 'RoleController@delete']);
   $router->post('/role/masive_load', ['uses' => 'RoleController@masiveLoad']);

   //CRUD RoleAssigment
   $router->post('/roleassigment', ['uses' => 'RoleAssigmentController@post']);
   $router->get('/roleassigment', ['uses' => 'RoleAssigmentController@get']);
   $router->get('/roleassigment/paginate', ['uses' => 'RoleAssigmentController@paginate']);
   $router->get('/roleassigment/backup', ['uses' => 'RoleAssigmentController@backup']);
   $router->put('/roleassigment', ['uses' => 'RoleAssigmentController@put']);
   $router->delete('/roleassigment', ['uses' => 'RoleAssigmentController@delete']);
   $router->post('/roleassigment/masive_load', ['uses' => 'RoleAssigmentController@masiveLoad']);
});
