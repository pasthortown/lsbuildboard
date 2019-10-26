<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\TaskState;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskStateController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(TaskState::orderBy('id')->get(),200);
       } else {
          $taskstate = TaskState::findOrFail($id);
          $attach = [];
          return response()->json(["TaskState"=>$taskstate, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(TaskState::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $taskstate = new TaskState();
          $lastTaskState = TaskState::orderBy('id')->get()->last();
          if($lastTaskState) {
             $taskstate->id = $lastTaskState->id + 1;
          } else {
             $taskstate->id = 1;
          }
          $taskstate->date_time = $result['date_time'];
          $taskstate->comment = $result['comment'];
          $taskstate->task_id = $result['task_id'];
          $taskstate->state_id = $result['state_id'];
          $taskstate->user_id = $result['user_id'];
          $taskstate->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($taskstate,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $taskstate = TaskState::where('id',$result['id'])->update([
             'date_time'=>$result['date_time'],
             'comment'=>$result['comment'],
             'task_id'=>$result['task_id'],
             'state_id'=>$result['state_id'],
             'user_id'=>$result['user_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($taskstate,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return TaskState::destroy($id);
    }

    function backup(Request $data)
    {
       $taskstates = TaskState::get();
       $toReturn = [];
       foreach( $taskstates as $taskstate) {
          $attach = [];
          array_push($toReturn, ["TaskState"=>$taskstate, "attach"=>$attach]);
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
         $result = $row['TaskState'];
         $exist = TaskState::where('id',$result['id'])->first();
         if ($exist) {
           TaskState::where('id', $result['id'])->update([
             'date_time'=>$result['date_time'],
             'comment'=>$result['comment'],
             'task_id'=>$result['task_id'],
             'state_id'=>$result['state_id'],
             'user_id'=>$result['user_id'],
           ]);
         } else {
          $taskstate = new TaskState();
          $taskstate->id = $result['id'];
          $taskstate->date_time = $result['date_time'];
          $taskstate->comment = $result['comment'];
          $taskstate->task_id = $result['task_id'];
          $taskstate->state_id = $result['state_id'];
          $taskstate->user_id = $result['user_id'];
          $taskstate->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}