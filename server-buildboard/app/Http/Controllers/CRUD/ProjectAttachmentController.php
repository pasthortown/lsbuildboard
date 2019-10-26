<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\ProjectAttachment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjectAttachmentController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(ProjectAttachment::orderBy('id')->get(),200);
       } else {
          $projectattachment = ProjectAttachment::findOrFail($id);
          $attach = [];
          return response()->json(["ProjectAttachment"=>$projectattachment, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(ProjectAttachment::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $projectattachment = new ProjectAttachment();
          $lastProjectAttachment = ProjectAttachment::orderBy('id')->get()->last();
          if($lastProjectAttachment) {
             $projectattachment->id = $lastProjectAttachment->id + 1;
          } else {
             $projectattachment->id = 1;
          }
          $projectattachment->project_attachment_file_type = $result['project_attachment_file_type'];
          $projectattachment->project_attachment_file_name = $result['project_attachment_file_name'];
          $projectattachment->project_attachment_file = $result['project_attachment_file'];
          $projectattachment->project_id = $result['project_id'];
          $projectattachment->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($projectattachment,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $projectattachment = ProjectAttachment::where('id',$result['id'])->update([
             'project_attachment_file_type'=>$result['project_attachment_file_type'],
             'project_attachment_file_name'=>$result['project_attachment_file_name'],
             'project_attachment_file'=>$result['project_attachment_file'],
             'project_id'=>$result['project_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($projectattachment,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return ProjectAttachment::destroy($id);
    }

    function backup(Request $data)
    {
       $projectattachments = ProjectAttachment::get();
       $toReturn = [];
       foreach( $projectattachments as $projectattachment) {
          $attach = [];
          array_push($toReturn, ["ProjectAttachment"=>$projectattachment, "attach"=>$attach]);
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
         $result = $row['ProjectAttachment'];
         $exist = ProjectAttachment::where('id',$result['id'])->first();
         if ($exist) {
           ProjectAttachment::where('id', $result['id'])->update([
             'project_attachment_file_type'=>$result['project_attachment_file_type'],
             'project_attachment_file_name'=>$result['project_attachment_file_name'],
             'project_attachment_file'=>$result['project_attachment_file'],
             'project_id'=>$result['project_id'],
           ]);
         } else {
          $projectattachment = new ProjectAttachment();
          $projectattachment->id = $result['id'];
          $projectattachment->project_attachment_file_type = $result['project_attachment_file_type'];
          $projectattachment->project_attachment_file_name = $result['project_attachment_file_name'];
          $projectattachment->project_attachment_file = $result['project_attachment_file'];
          $projectattachment->project_id = $result['project_id'];
          $projectattachment->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}