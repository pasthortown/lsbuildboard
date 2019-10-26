<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\ProjectComment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjectCommentController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(ProjectComment::orderBy('id')->get(),200);
       } else {
          $projectcomment = ProjectComment::findOrFail($id);
          $attach = [];
          return response()->json(["ProjectComment"=>$projectcomment, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(ProjectComment::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $projectcomment = new ProjectComment();
          $lastProjectComment = ProjectComment::orderBy('id')->get()->last();
          if($lastProjectComment) {
             $projectcomment->id = $lastProjectComment->id + 1;
          } else {
             $projectcomment->id = 1;
          }
          $projectcomment->description = $result['description'];
          $projectcomment->project_id = $result['project_id'];
          $projectcomment->user_id = $result['user_id'];
          $projectcomment->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($projectcomment,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $projectcomment = ProjectComment::where('id',$result['id'])->update([
             'description'=>$result['description'],
             'project_id'=>$result['project_id'],
             'user_id'=>$result['user_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($projectcomment,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return ProjectComment::destroy($id);
    }

    function backup(Request $data)
    {
       $projectcomments = ProjectComment::get();
       $toReturn = [];
       foreach( $projectcomments as $projectcomment) {
          $attach = [];
          array_push($toReturn, ["ProjectComment"=>$projectcomment, "attach"=>$attach]);
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
         $result = $row['ProjectComment'];
         $exist = ProjectComment::where('id',$result['id'])->first();
         if ($exist) {
           ProjectComment::where('id', $result['id'])->update([
             'description'=>$result['description'],
             'project_id'=>$result['project_id'],
             'user_id'=>$result['user_id'],
           ]);
         } else {
          $projectcomment = new ProjectComment();
          $projectcomment->id = $result['id'];
          $projectcomment->description = $result['description'];
          $projectcomment->project_id = $result['project_id'];
          $projectcomment->user_id = $result['user_id'];
          $projectcomment->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}