<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Task;
use App\TaskAttachment;
use App\TaskState;
use App\State;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Task::orderBy('id')->get(),200);
       } else {
          $task = Task::findOrFail($id);
          $attach = TaskAttachment::where('task_id', $id)->get();
          return response()->json(["Task"=>$task, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       $history_id = $data['history_id'];
       return response()->json(Task::where('history_id', $history_id)->orderBy('id')->paginate($size),200);
    }

    function groups(Request $data)
    {
       $toReturn = [];
       $tasks = [];
       $user_id = $data['user_id'];
       $states = State::orderBy('id')->get();
       $max_tasks_state_time = TaskState::select(DB::raw('MAX(updated_at) as time'), 'task_id')->groupBy('task_id')->orderBy('task_id')->get();
       foreach($max_tasks_state_time as $max_task_state_time) {
         $task_state = TaskState::where('task_states.updated_at', $max_task_state_time->time)->where('task_id', $max_task_state_time->task_id)
         ->leftJoin('tasks', 'tasks.id', '=', 'task_states.task_id')->select('tasks.*', 'task_states.state_id', 'task_states.updated_at as assigned_time', 'task_states.comment')->orderBy('tasks.id')->first();
         array_push($tasks, $task_state);
       }
       foreach($states as $state) {
         $tasks_in_state = [];
         foreach($tasks as $task) {
            if (($task->state_id == $state->id) && ($task->user_id == $user_id)) {
               array_push($tasks_in_state, $task);
            }
         }
         array_push($toReturn, ["group_title"=>$state->description, "tasks"=>$tasks_in_state]);
       }
       return response()->json($toReturn,200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $task = new Task();
          $lastTask = Task::orderBy('id')->get()->last();
          if($lastTask) {
             $task->id = $lastTask->id + 1;
          } else {
             $task->id = 1;
          }
          $task->title = $result['title'];
          $task->description = $result['description'];
          $task->time_expected = $result['time_expected'];
          $task->history_id = $result['history_id'];
          $task->user_id = $result['user_id'];
          $task->priority_id = $result['priority_id'];
          $task->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($task,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $task = Task::where('id',$result['id'])->update([
             'title'=>$result['title'],
             'description'=>$result['description'],
             'time_expected'=>$result['time_expected'],
             'history_id'=>$result['history_id'],
             'user_id'=>$result['user_id'],
             'priority_id'=>$result['priority_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($task,200);
    }

    function save(Request $data)
    {
      try{
         DB::beginTransaction();
         $result = $data->json()->all();
         $task_id = $result['task']['id'];
         $user_id = $result['task']['user_id'];
         if ( $task_id == 0) {
            $task = new Task();
            $lastTask = Task::orderBy('id')->get()->last();
            if($lastTask) {
               $task->id = $lastTask->id + 1;
            } else {
               $task->id = 1;
            }
            $task_id = $task->id;
            $task->title = $result['task']['title'];
            $task->description = $result['task']['description'];
            $task->time_expected = $result['task']['time_expected'];
            $task->history_id = $result['task']['history_id'];
            $task->user_id = $result['task']['user_id'];
            $task->priority_id = $result['task']['priority_id'];
            $task->save();   
            $taskstate = new TaskState();
            $lastTaskState = TaskState::orderBy('id')->get()->last();
            if($lastTaskState) {
               $taskstate->id = $lastTaskState->id + 1;
            } else {
               $taskstate->id = 1;
            }
            $taskstate->date_time = date("Y-m-d H:i:s");
            $taskstate->comment = 'Tarea creada';
            $taskstate->task_id = $task_id;
            $taskstate->state_id = 1;
            $taskstate->user_id = $user_id;
            $taskstate->save();
         } else {
            $task = Task::where('id',$task_id)->update([
               'title'=>$result['task']['title'],
               'description'=>$result['task']['description'],
               'time_expected'=>$result['task']['time_expected'],
               'history_id'=>$result['task']['history_id'],
               'user_id'=>$result['task']['user_id'],
               'priority_id'=>$result['task']['priority_id'],
            ]);
            $taskstate = new TaskState();
            $lastTaskState = TaskState::orderBy('id')->get()->last();
            if($lastTaskState) {
               $taskstate->id = $lastTaskState->id + 1;
            } else {
               $taskstate->id = 1;
            }
            $taskstate->date_time = date("Y-m-d H:i:s");
            $taskstate->comment = 'Tarea actualizada';
            $taskstate->task_id = $task_id;
            $taskstate->state_id = 1;
            $taskstate->user_id = $user_id;
            $taskstate->save();
         }
         $attachments = $result['attachments'];
         $last_attachments = TaskAttachment::where('task_id', $task_id)->get();
         foreach($last_attachments as $last_attachment) {
            TaskAttachment::destroy($last_attachment['id']);
         }
         foreach($attachments as $attachment) {
            $taskattachment = new TaskAttachment();
            $lastTaskAttachment = TaskAttachment::orderBy('id')->get()->last();
            if($lastTaskAttachment) {
               $taskattachment->id = $lastTaskAttachment->id + 1;
            } else {
               $taskattachment->id = 1;
            }
            $taskattachment->task_attachment_file_type = $attachment['task_attachment_file_type'];
            $taskattachment->task_attachment_file_name = $attachment['task_attachment_file_name'];
            $taskattachment->task_attachment_file = $attachment['task_attachment_file'];
            $taskattachment->task_id = $task_id;
            $taskattachment->save();
         }
         DB::commit();
      } catch (Exception $e) {
         return $e;
      }
      return response()->json($result,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Task::destroy($id);
    }

    function backup(Request $data)
    {
       $tasks = Task::get();
       $toReturn = [];
       foreach( $tasks as $task) {
          $attach = [];
          array_push($toReturn, ["Task"=>$task, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['Task'];
         $exist = Task::where('id',$result['id'])->first();
         if ($exist) {
           Task::where('id', $result['id'])->update([
             'title'=>$result['title'],
             'description'=>$result['description'],
             'time_expected'=>$result['time_expected'],
             'history_id'=>$result['history_id'],
             'user_id'=>$result['user_id'],
             'priority_id'=>$result['priority_id'],
           ]);
         } else {
          $task = new Task();
          $task->id = $result['id'];
          $task->title = $result['title'];
          $task->description = $result['description'];
          $task->time_expected = $result['time_expected'];
          $task->history_id = $result['history_id'];
          $task->user_id = $result['user_id'];
          $task->priority_id = $result['priority_id'];
          $task->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}