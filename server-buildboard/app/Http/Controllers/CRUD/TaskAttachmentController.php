<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\TaskAttachment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskAttachmentController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(TaskAttachment::orderBy('id')->get(),200);
       } else {
          $taskattachment = TaskAttachment::findOrFail($id);
          $attach = [];
          return response()->json(["TaskAttachment"=>$taskattachment, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(TaskAttachment::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $taskattachment = new TaskAttachment();
          $lastTaskAttachment = TaskAttachment::orderBy('id')->get()->last();
          if($lastTaskAttachment) {
             $taskattachment->id = $lastTaskAttachment->id + 1;
          } else {
             $taskattachment->id = 1;
          }
          $taskattachment->task_attachment_file_type = $result['task_attachment_file_type'];
          $taskattachment->task_attachment_file_name = $result['task_attachment_file_name'];
          $taskattachment->task_attachment_file = $result['task_attachment_file'];
          $taskattachment->task_id = $result['task_id'];
          $taskattachment->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($taskattachment,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $taskattachment = TaskAttachment::where('id',$result['id'])->update([
             'task_attachment_file_type'=>$result['task_attachment_file_type'],
             'task_attachment_file_name'=>$result['task_attachment_file_name'],
             'task_attachment_file'=>$result['task_attachment_file'],
             'task_id'=>$result['task_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($taskattachment,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return TaskAttachment::destroy($id);
    }

    function backup(Request $data)
    {
       $taskattachments = TaskAttachment::get();
       $toReturn = [];
       foreach( $taskattachments as $taskattachment) {
          $attach = [];
          array_push($toReturn, ["TaskAttachment"=>$taskattachment, "attach"=>$attach]);
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
         $result = $row['TaskAttachment'];
         $exist = TaskAttachment::where('id',$result['id'])->first();
         if ($exist) {
           TaskAttachment::where('id', $result['id'])->update([
             'task_attachment_file_type'=>$result['task_attachment_file_type'],
             'task_attachment_file_name'=>$result['task_attachment_file_name'],
             'task_attachment_file'=>$result['task_attachment_file'],
             'task_id'=>$result['task_id'],
           ]);
         } else {
          $taskattachment = new TaskAttachment();
          $taskattachment->id = $result['id'];
          $taskattachment->task_attachment_file_type = $result['task_attachment_file_type'];
          $taskattachment->task_attachment_file_name = $result['task_attachment_file_name'];
          $taskattachment->task_attachment_file = $result['task_attachment_file'];
          $taskattachment->task_id = $result['task_id'];
          $taskattachment->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}