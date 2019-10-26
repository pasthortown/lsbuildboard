<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Project;
use App\ProjectAttachment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjectController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Project::orderBy('id')->get(),200);
       } else {
          $project = Project::findOrFail($id);
          $attach = ProjectAttachment::where('project_id', $id)->get();
          return response()->json(["Project"=>$project, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Project::orderBy('id')->paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $project = new Project();
          $lastProject = Project::orderBy('id')->get()->last();
          if($lastProject) {
             $project->id = $lastProject->id + 1;
          } else {
             $project->id = 1;
          }
          $project->name = $result['name'];
          $project->description = $result['description'];
          $project->start_date = $result['start_date'];
          $project->dod_date = $result['dod_date'];
          $project->dor_date = $result['dor_date'];
          $project->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($project,200);
    }

    function save(Request $data)
    {
      try{
         DB::beginTransaction();
         $result = $data->json()->all();
         $project_id = $result['project']['id'];
         if ( $project_id == 0) {
            $project = new Project();
            $lastProject = Project::orderBy('id')->get()->last();
            if($lastProject) {
               $project->id = $lastProject->id + 1;
            } else {
               $project->id = 1;
            }
            $project_id = $project->id;
            $project->name = $result['project']['name'];
            $project->description = $result['project']['description'];
            $project->start_date = $result['project']['start_date'];
            $project->dod_date = $result['project']['dod_date'];
            $project->dor_date = $result['project']['dor_date'];
            $project->save();   
         } else {
            $project = Project::where('id', $project_id)->update([
               'name'=>$result['project']['name'],
               'description'=>$result['project']['description'],
               'start_date'=>$result['project']['start_date'],
               'dod_date'=>$result['project']['dod_date'],
               'dor_date'=>$result['project']['dor_date'],
            ]);
         }
         $attachments = $result['attachments'];
         $last_attachments = ProjectAttachment::where('project_id', $project_id)->get();
         foreach($last_attachments as $last_attachment) {
            ProjectAttachment::destroy($last_attachment['id']);
         }
         foreach($attachments as $attachment) {
            $projectattachment = new ProjectAttachment();
            $lastProjectAttachment = ProjectAttachment::orderBy('id')->get()->last();
            if($lastProjectAttachment) {
               $projectattachment->id = $lastProjectAttachment->id + 1;
            } else {
               $projectattachment->id = 1;
            }
            $projectattachment->project_attachment_file_type = $attachment['project_attachment_file_type'];
            $projectattachment->project_attachment_file_name = $attachment['project_attachment_file_name'];
            $projectattachment->project_attachment_file = $attachment['project_attachment_file'];
            $projectattachment->project_id = $project_id;
            $projectattachment->save();
         }
         DB::commit();
      } catch (Exception $e) {
         return $e;
      }
      return response()->json($result,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $project = Project::where('id',$result['id'])->update([
             'name'=>$result['name'],
             'description'=>$result['description'],
             'start_date'=>$result['start_date'],
             'dod_date'=>$result['dod_date'],
             'dor_date'=>$result['dor_date'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($project,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Project::destroy($id);
    }

    function backup(Request $data)
    {
       $projects = Project::get();
       $toReturn = [];
       foreach( $projects as $project) {
          $attach = [];
          array_push($toReturn, ["Project"=>$project, "attach"=>$attach]);
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
         $result = $row['Project'];
         $exist = Project::where('id',$result['id'])->first();
         if ($exist) {
           Project::where('id', $result['id'])->update([
             'name'=>$result['name'],
             'description'=>$result['description'],
             'start_date'=>$result['start_date'],
             'dod_date'=>$result['dod_date'],
             'dor_date'=>$result['dor_date'],
           ]);
         } else {
          $project = new Project();
          $project->id = $result['id'];
          $project->name = $result['name'];
          $project->description = $result['description'];
          $project->start_date = $result['start_date'];
          $project->dod_date = $result['dod_date'];
          $project->dor_date = $result['dor_date'];
          $project->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}