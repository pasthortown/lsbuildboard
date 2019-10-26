<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\WorkTime;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class WorkTimeController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(WorkTime::orderBy('id')->get(),200);
       } else {
          $worktime = WorkTime::findOrFail($id);
          $attach = [];
          return response()->json(["WorkTime"=>$worktime, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(WorkTime::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $worktime = new WorkTime();
          $lastWorkTime = WorkTime::orderBy('id')->get()->last();
          if($lastWorkTime) {
             $worktime->id = $lastWorkTime->id + 1;
          } else {
             $worktime->id = 1;
          }
          $worktime->start = $result['start'];
          $worktime->end = $result['end'];
          $worktime->task_id = $result['task_id'];
          $worktime->user_id = $result['user_id'];
          $worktime->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($worktime,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $worktime = WorkTime::where('id',$result['id'])->update([
             'start'=>$result['start'],
             'end'=>$result['end'],
             'task_id'=>$result['task_id'],
             'user_id'=>$result['user_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($worktime,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return WorkTime::destroy($id);
    }

    function backup(Request $data)
    {
       $worktimes = WorkTime::get();
       $toReturn = [];
       foreach( $worktimes as $worktime) {
          $attach = [];
          array_push($toReturn, ["WorkTime"=>$worktime, "attach"=>$attach]);
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
         $result = $row['WorkTime'];
         $exist = WorkTime::where('id',$result['id'])->first();
         if ($exist) {
           WorkTime::where('id', $result['id'])->update([
             'start'=>$result['start'],
             'end'=>$result['end'],
             'task_id'=>$result['task_id'],
             'user_id'=>$result['user_id'],
           ]);
         } else {
          $worktime = new WorkTime();
          $worktime->id = $result['id'];
          $worktime->start = $result['start'];
          $worktime->end = $result['end'];
          $worktime->task_id = $result['task_id'];
          $worktime->user_id = $result['user_id'];
          $worktime->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}